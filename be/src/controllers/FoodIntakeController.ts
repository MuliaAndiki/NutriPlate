import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import foodIntakeService from '@/service/foodIntake.service';
import prisma from 'prisma/client';
import crypto from 'crypto';
import { cacheKeys } from '@/cache/cacheKey';
import { getRedis } from '@/utils/redis';
import { error } from 'console';
import { PickFoodID } from '@/types/food.types';

class FoodIntakeController {
  private get redis() {
    return getRedis();
  }
  /**
   * POST /api/food/intake
   *
   * Flow:
   * 1. Validate input (childId, totalWeightGram required)
   * 2. Load image & generate hash
   * 3. Call ML inference (with Redis cache)
   * 4. Process detections & calculate nutrition
   * 5. Save to DB (atomic transaction)
   * 6. Return final JSON
   */
  public async createFoodIntake(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const startTime = Date.now();

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const body = c.body as any;
      const { childId, iotId, photoUrl, totalWeightGram } = body;

      if (!childId || !totalWeightGram) {
        return c.json?.(
          {
            status: 400,
            message: 'childId and totalWeightGram are required',
          },
          400,
        );
      }

      const weightNum = Number(totalWeightGram);
      if (isNaN(weightNum) || weightNum <= 0) {
        return c.json?.(
          {
            status: 400,
            message: 'totalWeightGram must be a number > 0',
          },
          400,
        );
      }

      const child = await prisma.child.findUnique({
        where: { id: childId },
        select: { parentId: true },
      });

      if (!child) {
        return c.json?.(
          {
            status: 404,
            message: 'Child not found',
          },
          404,
        );
      }

      if (jwtUser.role === 'PARENT' && child.parentId !== jwtUser.id) {
        return c.json?.(
          {
            status: 403,
            message: 'Forbidden: Cannot access this child',
          },
          403,
        );
      }

      let imageBuffer: Buffer | undefined;
      let inferenceHash: string | undefined;

      if (c.files?.image?.[0]) {
        try {
          const file = c.files.image[0];
          imageBuffer = file.buffer;
          inferenceHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
        } catch (error) {
          return c.json?.(
            {
              status: 400,
              message: 'Failed to process image',
              error: error instanceof Error ? error.message : error,
            },
            400,
          );
        }
      } else {
        console.log('  No image file provided, proceeding without inference');
      }

      let detections: any[] = [];
      let mlModelVersion = 'dietary_yolov8s';

      if (imageBuffer) {
        try {
          detections = await foodIntakeService.inferenceYolo(imageBuffer);
          console.log(` Inference complete: ${detections.length} items detected`);

          if (detections.length === 0) {
            return c.json?.(
              {
                status: 400,
                message: 'No food items detected in image',
              },
              400,
            );
          }
        } catch (error) {
          console.error(' Inference failed:', error);
          return c.json?.(
            {
              status: 500,
              message: 'Food detection failed',
              error: error instanceof Error ? error.message : error,
            },
            500,
          );
        }
      } else {
        return c.json?.(
          {
            status: 400,
            message: 'Image file is required for food detection',
          },
          400,
        );
      }

      let processedItems: any[];
      try {
        processedItems = await foodIntakeService.processDetectionsAndCalculateNutrition(
          weightNum,
          detections,
          mlModelVersion,
        );
        console.log(` Nutrition calculated for ${processedItems.length} items`);
      } catch (error) {
        console.error(' Nutrition calculation failed:', error);
        return c.json?.(
          {
            status: 422,
            message: 'Food detection validation failed',
            error: error instanceof Error ? error.message : error,
            hint: 'Check if: area_ratio sum ≈ 1.0 (±0.15), all confidence > 0.5, total_weight > 0',
          },
          422,
        );
      }

      let savedData: any;
      try {
        savedData = await foodIntakeService.saveToDatabase(
          childId,
          iotId,
          photoUrl,
          Number(totalWeightGram),
          processedItems,
          mlModelVersion,
          inferenceHash,
        );
        console.log(` Food intake saved: ${savedData.foodIntake.id}`);
      } catch (error) {
        console.error(' Database save failed:', error);
        return c.json?.(
          {
            status: 500,
            message: 'Failed to save food intake',
            error: error instanceof Error ? error.message : error,
          },
          500,
        );
      }

      const processingTime = Date.now() - startTime;
      // create for dataset here
      await prisma.foodRawImage.create({
        data: {
          uploader_id: jwtUser.id,
          source_food_id: savedData.foodIntake.id,
          image_url: photoUrl,
          status: 'pending_label',
        },
      });
      return c.json?.(
        {
          status: 201,
          message: 'Food intake created successfully',
          data: {
            success: true,
            foodIntakeId: savedData.foodIntake.id,
            childId,
            totalWeightGram: Number(savedData.foodIntake.totalWeightGram),
            items: savedData.items.map((item: any) => ({
              foodClassName: item.foodClassName,
              weightGram: Number(item.weightGram),
              mlConfidence: Number(item.mlConfidence),
              areaRatio: Number(item.areaRatio),
              energyKcal: item.energyKcal ? Number(item.energyKcal) : null,
              proteinGram: item.proteinGram ? Number(item.proteinGram) : null,
              fatGram: item.fatGram ? Number(item.fatGram) : null,
              carbGram: item.carbGram ? Number(item.carbGram) : null,
            })),
            metadata: {
              modelVersion: mlModelVersion,
              threshold: 0.5,
              areaRatioTolerance: 0.15,
              detectionCount: detections.length,
              areaRatioSum: detections.reduce((sum, d) => sum + d.area_ratio, 0).toFixed(2),
              processingTime: `${processingTime}ms`,
              inferenceHash: inferenceHash?.slice(0, 8) + '...',
              inferenceSource: 'YOLOv8s',
              validationStatus: 'PASSED',
            },
          },
        },
        201,
      );
    } catch (error) {
      console.error(' Unexpected error in createFoodIntake:', error);
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async getHistoryFood(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const cacheKey = cacheKeys.food.byUser(jwtUser.id);

      try {
        const cache = await this.redis.get(cacheKey);
        if (cache) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get history Food',
              data: JSON.parse(cache),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const history = await prisma.food.findMany({
        where: {
          child: {
            parentId: jwtUser.id,
          },
        },
        take: 10,
      });
      if (!history) {
        return c.json?.(
          {
            status: 400,
            message: 'failed get history',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(history), {
          EX: 60,
        });
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get history',
          data: history,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async getHisoryFoodByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickFoodID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      const cacheKey = cacheKeys.food.byID(params.id);

      try {
        const cache = await this.redis.get(cacheKey);
        if (cache) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get food by id (cache)',
              data: JSON.parse(cache),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const food = await prisma.food.findUnique({
        where: {
          id: params.id,
        },
        include: {
          items: true,
        },
      });

      if (!food) {
        return c.json?.(
          {
            status: 400,
            message: 'server error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(food), { EX: 60 });
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get food',
          data: food,
        },
        200,
      );
    } catch (error) {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
}

export default new FoodIntakeController();
