import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import foodIntakeService from '@/service/foodIntake.service';
import prisma from 'prisma/client';
import crypto from 'crypto';
import { cacheKeys } from '@/cache/cacheKey';
import { getRedis } from '@/utils/redis';
import { PickFoodID, FoodHistoryQuery } from '@/types/food.types';
import { uploadCloudinary } from '@/utils/clodinary';

class FoodIntakeController {
  private get redis() {
    return getRedis();
  }

  private async invalidateFoodCaches(userId: string, childId?: string, foodIntakeId?: string) {
    try {
      const patterns: string[] = [
        cacheKeys.food.byUser(userId),
        `${cacheKeys.food.history(userId, '*')}*`,
      ];

      if (childId) {
        patterns.push(`${cacheKeys.food.history(userId, childId)}*`);
      }

      if (foodIntakeId) {
        patterns.push(cacheKeys.food.byID(foodIntakeId));
      }

      for (const pattern of patterns) {
        let cursor = '0';
        do {
          const { cursor: nextCursor, keys } = await this.redis.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
          });
          cursor = String(nextCursor);

          if (keys.length > 0) {
            await this.redis.del(keys);
            console.log(`Invalidated ${keys.length} food cache entries for pattern: ${pattern}`);
          }
        } while (cursor !== '0');
      }
    } catch (error) {
      console.warn('Failed to invalidate food caches:', error);
    }
  }

  private formatFoodItems(items: any[]) {
    return items.map((item) => ({
      id: item.id,
      foodClassName: item.foodClassName,
      weightGram: Number(item.weightGram),
      mlConfidence: Number(item.mlConfidence),
      areaRatio: Number(item.areaRatio),
      bboxData: item.bboxData || null,
      metadata: item.metadata || null,
      energyKcal: item.energyKcal ? Number(item.energyKcal) : null,
      proteinGram: item.proteinGram ? Number(item.proteinGram) : null,
      fatGram: item.fatGram ? Number(item.fatGram) : null,
      carbGram: item.carbGram ? Number(item.carbGram) : null,
      fiberGram: item.fiberGram ? Number(item.fiberGram) : null,
      calciumMg: item.calciumMg ? Number(item.calciumMg) : null,
      ironMg: item.ironMg ? Number(item.ironMg) : null,
      vitaminA: item.vitaminA ? Number(item.vitaminA) : null,
      vitaminC: item.vitaminC ? Number(item.vitaminC) : null,
      createdAt: item.createdAt,
    }));
  }

  private formatFoodResponse(food: any) {
    let parsedTotals = {
      energyKcal: 0,
      proteinGram: 0,
      fatGram: 0,
      carbGram: 0,
      fiberGram: 0,
      calciumMg: 0,
      ironMg: 0,
      vitaminA: 0,
      vitaminC: 0,
    };

    if (food.totals) {
      try {
        if (typeof food.totals === 'string') {
          parsedTotals = JSON.parse(food.totals);
        } else if (typeof food.totals === 'object') {
          parsedTotals = food.totals;
        }
      } catch (e) {
        console.warn('Failed to parse totals JSON:', e);
      }
    }

    const shouldCalculateFromItems =
      parsedTotals.energyKcal === 0 && food.items && food.items.length > 0;

    if (shouldCalculateFromItems) {
      parsedTotals = {
        energyKcal: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.energyKcal) || 0),
          0,
        ),
        proteinGram: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.proteinGram) || 0),
          0,
        ),
        fatGram: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.fatGram) || 0),
          0,
        ),
        carbGram: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.carbGram) || 0),
          0,
        ),
        fiberGram: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.fiberGram) || 0),
          0,
        ),
        calciumMg: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.calciumMg) || 0),
          0,
        ),
        ironMg: food.items.reduce((sum: number, item: any) => sum + (Number(item.ironMg) || 0), 0),
        vitaminA: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.vitaminA) || 0),
          0,
        ),
        vitaminC: food.items.reduce(
          (sum: number, item: any) => sum + (Number(item.vitaminC) || 0),
          0,
        ),
      };
    }

    return {
      id: food.id,
      childId: food.childId,
      iotId: food.iotId || null,
      photoUrl: food.photoUrl || null,
      title: food.title,
      totalWeightGram: Number(food.totalWeightGram),
      createdAt: food.createdAt,
      updatedAt: food.updatedAt,
      totals: {
        energyKcal: Number((parsedTotals.energyKcal || 0).toFixed(2)),
        proteinGram: Number((parsedTotals.proteinGram || 0).toFixed(2)),
        fatGram: Number((parsedTotals.fatGram || 0).toFixed(2)),
        carbGram: Number((parsedTotals.carbGram || 0).toFixed(2)),
        fiberGram: Number((parsedTotals.fiberGram || 0).toFixed(2)),
        calciumMg: Number((parsedTotals.calciumMg || 0).toFixed(2)),
        ironMg: Number((parsedTotals.ironMg || 0).toFixed(2)),
        vitaminA: Number((parsedTotals.vitaminA || 0).toFixed(2)),
        vitaminC: Number((parsedTotals.vitaminC || 0).toFixed(2)),
      },
      items: food.items ? this.formatFoodItems(food.items) : [],
    };
  }

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

      let childId: string | undefined;
      let iotId: string | undefined;
      let photoUrl: string | undefined;
      let totalWeightGram: string | undefined;
      let imageBuffer: Buffer | undefined;

      const bodyData = c.body as any;
      childId = bodyData?.childId;
      iotId = bodyData?.iotId;
      totalWeightGram = bodyData?.totalWeightGram;

      if (bodyData?.image && bodyData.image instanceof File) {
        try {
          imageBuffer = Buffer.from(await bodyData.image.arrayBuffer());
          console.log(' Image file received from bodyData.image, buffer size:', imageBuffer.length);

          const result = await uploadCloudinary(imageBuffer, 'food_intake', bodyData.image.name);
          photoUrl = result.secure_url;
          console.log(' Image uploaded to Cloudinary:', photoUrl);
        } catch (err) {
          console.error(' Failed to process image file:', err);
          return c.json?.(
            {
              status: 400,
              message: 'Failed to process image file',
              error: err instanceof Error ? err.message : String(err),
            },
            400,
          );
        }
      }
      // Handle image upload from multipart form
      else if (c.files?.image?.[0]) {
        try {
          const file = c.files.image[0];
          imageBuffer = file.buffer as Buffer;
          console.log(' Image file received from c.files, buffer size:', imageBuffer.length);

          const result = await uploadCloudinary(imageBuffer, 'food_intake', file.originalname);
          photoUrl = result.secure_url;
          console.log(' Image uploaded to Cloudinary:', photoUrl);
        } catch (err) {
          console.error(' Failed to process image file from c.files:', err);
          return c.json?.(
            {
              status: 400,
              message: 'Failed to process image file',
              error: err instanceof Error ? err.message : String(err),
            },
            400,
          );
        }
      }
      // Handle base64 image or direct URL
      else if (bodyData?.photoUrl && typeof bodyData.photoUrl === 'string') {
        const tempPhotoUrl = bodyData.photoUrl;
        console.log(' photoUrl received directly:', tempPhotoUrl);

        if (tempPhotoUrl.startsWith('data:image')) {
          try {
            const base64 = tempPhotoUrl;
            const buffer = Buffer.from(base64.split(',')[1], 'base64');
            const result = await uploadCloudinary(buffer, 'food_intake', 'food_image.png');
            photoUrl = result.secure_url;
            imageBuffer = buffer;
            console.log(' Base64 image uploaded to Cloudinary:', photoUrl);
          } catch (err) {
            console.error(' Failed to upload base64 image to Cloudinary:', err);
            return c.json?.(
              {
                status: 400,
                message: 'Failed to upload image',
                error: err instanceof Error ? err.message : String(err),
              },
              400,
            );
          }
        } else {
          photoUrl = tempPhotoUrl;
        }
      } else {
        console.log(' No image file found - bodyData:', bodyData, 'c.files:', c.files);
      }

      if (!childId || !totalWeightGram) {
        console.error(
          ' Missing required fields - childId:',
          childId,
          'totalWeightGram:',
          totalWeightGram,
          'bodyData:',
          bodyData,
        );
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
        select: { parentId: true, fullName: true },
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

      // Generate inference hash for caching
      let inferenceHash: string | undefined;
      if (imageBuffer) {
        try {
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
      }

      // Perform ML inference
      let detections: any[] = [];
      let imageSize: { width: number; height: number } | undefined;
      let mlModelVersion = 'dietary_yolov8s';

      if (imageBuffer) {
        try {
          const inferenceResult = await foodIntakeService.inferenceYolo(imageBuffer);
          detections = inferenceResult.detections;
          imageSize = inferenceResult.image_size;
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

      // Calculate nutrition
      let processedItems: any[];
      try {
        processedItems = await foodIntakeService.processDetectionsAndCalculateNutrition(
          weightNum,
          detections,
          mlModelVersion,
          imageSize,
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

      if (photoUrl) {
        await prisma.foodRawImage.create({
          data: {
            uploader_id: jwtUser.id,
            source_food_id: savedData.foodIntake.id,
            image_url: photoUrl,
            status: 'pending_label',
          },
        });
        console.log(' FoodRawImage created with Cloudinary URL');
      }

      await this.invalidateFoodCaches(jwtUser.id, childId, savedData.foodIntake.id);

      const processingTime = Date.now() - startTime;

      const foodWithItems = {
        ...savedData.foodIntake,
        items: savedData.items,
      };

      return c.json?.(
        {
          status: 201,
          message: 'Food intake created successfully',
          data: {
            ...this.formatFoodResponse(foodWithItems),
            processingMetadata: {
              modelVersion: mlModelVersion,
              threshold: 0.5,
              areaRatioTolerance: 0.15,
              detectionCount: detections.length,
              areaRatioSum: detections.reduce((sum, d) => sum + d.area_ratio, 0).toFixed(4),
              processingTime: `${processingTime}ms`,
              inferenceHash: inferenceHash?.slice(0, 8) + '...',
              inferenceSource: 'YOLOv8s',
              validationStatus: 'PASSED',
              imageSource: photoUrl ? 'Cloudinary' : 'No image',
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

  public async getHistoryFoodByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickFoodID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.id) {
        return c.json?.({ status: 400, message: 'Food intake ID is required' }, 400);
      }

      const cacheKey = cacheKeys.food.byID(params.id);

      try {
        const cache = await this.redis.get(cacheKey);
        if (cache) {
          return c.json?.(
            {
              status: 200,
              message: 'Successfully retrieved food intake (cached)',
              data: JSON.parse(cache),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`Redis cache error: ${error}`);
      }

      const food = await prisma.food.findUnique({
        where: { id: params.id },
        include: {
          items: {
            select: {
              id: true,
              foodClassName: true,
              mlConfidence: true,
              areaRatio: true,
              weightGram: true,
              energyKcal: true,
              proteinGram: true,
              fatGram: true,
              carbGram: true,
              fiberGram: true,
              bboxData: true,
              metadata: true,
              createdAt: true,
            },
          },
          child: {
            select: {
              id: true,
              parentId: true,
              fullName: true,
              avaChild: true,
              dateOfBirth: true,
              gender: true,
            },
          },
        },
      });

      if (!food) {
        return c.json?.({ status: 404, message: 'Food intake not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && food.child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden: Cannot access this food intake' }, 403);
      }

      const response = this.formatFoodResponse(food);

      await this.redis.setEx(cacheKey, 300, JSON.stringify(response));

      return c.json?.(
        {
          status: 200,
          message: 'Successfully retrieved food intake',
          data: response,
        },
        200,
      );
    } catch (error) {
      console.error('getHistoryFoodByID error:', error);
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

  public async getFoodHistoryByChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as { childId: string };
      const query = c.query as FoodHistoryQuery;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.childId) {
        return c.json?.({ status: 400, message: 'Child ID is required' }, 400);
      }

      const child = await prisma.child.findUnique({
        where: { id: params.childId },
        select: { parentId: true, fullName: true },
      });

      if (!child) {
        return c.json?.({ status: 404, message: 'Child not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden: Cannot access this child' }, 403);
      }

      const page = Math.max(1, parseInt(query.page || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
      const skip = (page - 1) * limit;

      const whereClause: any = {
        childId: params.childId,
      };

      if (query.startDate || query.endDate) {
        whereClause.createdAt = {};
        if (query.startDate) {
          whereClause.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          whereClause.createdAt.lte = new Date(query.endDate);
        }
      }

      const cacheKey = cacheKeys.food.historyByChild(
        params.childId,
        page,
        limit,
        query.startDate || '',
        query.endDate || '',
      );

      try {
        const cache = await this.redis.get(cacheKey);
        if (cache) {
          return c.json?.(JSON.parse(cache), 200);
        }
      } catch (error) {
        console.warn(`Redis cache error: ${error}`);
      }

      // Fetch from database
      const [history, total] = await Promise.all([
        prisma.food.findMany({
          where: whereClause,
          include: {
            items: {
              select: {
                id: true,
                foodClassName: true,
                mlConfidence: true,
                weightGram: true,
                bboxData: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.food.count({ where: whereClause }),
      ]);

      const response = {
        status: 200,
        message: `Successfully retrieved food history for ${child.fullName}`,
        data: {
          child: {
            id: params.childId,
            fullName: child.fullName,
          },
          items: history.map((food) => this.formatFoodResponse(food)),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        },
      };

      await this.redis.setEx(cacheKey, 60, JSON.stringify(response));

      return c.json?.(response, 200);
    } catch (error) {
      console.error('getFoodHistoryByChild error:', error);
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

  public async deleteFoodIntake(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickFoodID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.id) {
        return c.json?.({ status: 400, message: 'Food intake ID is required' }, 400);
      }

      const food = await prisma.food.findUnique({
        where: { id: params.id },
        include: {
          child: {
            select: { parentId: true },
          },
        },
      });

      if (!food) {
        return c.json?.({ status: 404, message: 'Food intake not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && food.child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden: Cannot delete this food intake' }, 403);
      }

      await prisma.$transaction(async (tx) => {
        await tx.foodRawImage.deleteMany({
          where: { source_food_id: params.id },
        });

        await tx.foodIntakeItem.deleteMany({
          where: { foodIntakeId: params.id },
        });

        await tx.food.delete({
          where: { id: params.id },
        });
      });

      await this.invalidateFoodCaches(jwtUser.id, food.childId, params.id);

      return c.json?.(
        {
          status: 200,
          message: 'Food intake deleted successfully',
          data: { id: params.id },
        },
        200,
      );
    } catch (error) {
      console.error('deleteFoodIntake error:', error);
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

  public async getFoodVisualization(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickFoodID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.id) {
        return c.json?.({ status: 400, message: 'Food intake ID is required' }, 400);
      }

      const food = await prisma.food.findUnique({
        where: { id: params.id },
        include: {
          child: {
            select: { parentId: true, fullName: true },
          },
        },
      });

      if (!food) {
        return c.json?.({ status: 404, message: 'Food intake not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && food.child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden: Cannot access this food intake' }, 403);
      }

      const visualizationData = await foodIntakeService.getItemsForVisualization(params.id);

      return c.json?.(
        {
          status: 200,
          message: 'Successfully retrieved visualization data',
          data: {
            foodIntakeId: params.id,
            childName: food.child.fullName,
            photoUrl: food.photoUrl,
            totalWeightGram: Number(food.totalWeightGram),
            createdAt: food.createdAt,
            items: visualizationData,
          },
        },
        200,
      );
    } catch (error) {
      console.error('getFoodVisualization error:', error);
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
}

export default new FoodIntakeController();
