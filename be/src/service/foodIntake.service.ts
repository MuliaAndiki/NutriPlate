import { AxiosService } from '@/utils/axios';
import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import crypto from 'crypto';
import { FoodDetection } from '@/types/foodIntake.types';
import { Prisma } from '@prisma/client';
import { cacheKeys } from '@/cache/cacheKey';
import foodIntakeSummaryService from './foodIntakeSummary.service';
import FormData from 'form-data';
import { normalizeFoodClassKey } from '@/utils/normalizer';
import { v4 as uuidv4 } from 'uuid';

interface BoundingBoxPixel {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  [key: string]: any;
}

interface BoundingBoxNormalized {
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
}

interface BoundingBoxData {
  normalized?: BoundingBoxNormalized;
  pixel?: BoundingBoxPixel;
  imageSize?: {
    width: number;
    height: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ProcessedItem {
  id: string;
  foodClassName: string;
  mlConfidence: number;
  areaRatio: number;
  weightGram: number;
  energyKcal: number;
  proteinGram: number;
  fatGram: number;
  carbGram: number;
  fiberGram: number;
  calciumMg: number;
  ironMg: number;
  vitaminA: number;
  vitaminC: number;
  bboxData?: BoundingBoxData;
  metadata: any;
}

const toPrismaJson = (value: any): any => {
  if (value === null || value === undefined) {
    return Prisma.JsonNull;
  }
  return value;
};

const fromPrismaJson = (value: any): any => {
  if (value === Prisma.JsonNull || value === null || value === undefined) {
    return null;
  }
  return value;
};

class FoodIntakeService {
  private MlGate;
  private isAxiosError;
  private redis;

  constructor() {
    const { MlHit, isAxiosError } = AxiosService();
    this.MlGate = MlHit;
    this.isAxiosError = isAxiosError;
    this.redis = getRedis();
  }

  public async inferenceYolo(imageBuffer: Buffer): Promise<{
    detections: FoodDetection[];
    image_size?: { width: number; height: number };
  }> {
    try {
      const imageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
      const cacheKey = cacheKeys.models.detect(imageHash);
      console.log('ML BASE URL:', this.MlGate.defaults.baseURL);

      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      } catch {}

      const formData = new FormData();
      formData.append('image', imageBuffer, {
        filename: 'food.jpg',
        contentType: 'image/jpeg',
      });

      const response = await this.MlGate.post('/detect', formData, {
        headers: formData.getHeaders(),
      });

      if (!response.data?.success || !response.data?.detections) {
        throw new Error('Invalid ML response');
      }

      const result = {
        detections: response.data.detections as FoodDetection[],
        image_size: response.data.image_size,
      };

      await this.redis.setEx(cacheKey, 86400, JSON.stringify(result));
      return result;
    } catch (err) {
      throw new Error(`Inference failed: ${err}`);
    }
  }

  private transformDetections(
    detections: FoodDetection[],
    imageSize?: { width: number; height: number },
  ): any[] {
    const imgWidth = imageSize?.width || 640;
    const imgHeight = imageSize?.height || 640;

    return detections.map((detection) => {
      const bbox = detection.bounding_box;
      const bboxWidth = bbox.x2 - bbox.x1;
      const bboxHeight = bbox.y2 - bbox.y1;

      const bboxData: BoundingBoxData = {
        normalized: {
          x: bbox.x1 / imgWidth,
          y: bbox.y1 / imgHeight,
          width: bboxWidth / imgWidth,
          height: bboxHeight / imgHeight,
        },
        pixel: {
          x1: bbox.x1,
          y1: bbox.y1,
          x2: bbox.x2,
          y2: bbox.y2,
          width: bboxWidth,
          height: bboxHeight,
        },
        imageSize: {
          width: imgWidth,
          height: imgHeight,
        },
      };

      return {
        ...detection,
        bboxData,
      };
    });
  }

  private async getNutrientPer100g(foodClassName: string) {
    const normalizedName = normalizeFoodClassKey(foodClassName);
    const cacheKey = `nutrient:${normalizedName}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const foodClass = await prisma.foodClasses.findUnique({
      where: { name: normalizedName },
    });

    const nutrient = foodClass
      ? {
          energyKcal: Number(foodClass.energyKcal ?? 0),
          proteinGram: Number(foodClass.proteinGram ?? 0),
          fatGram: Number(foodClass.fatGram ?? 0),
          carbGram: Number(foodClass.carbGram ?? 0),
          fiberGram: 0,
          calciumMg: 0,
          ironMg: 0,
          vitaminA: 0,
          vitaminC: 0,
        }
      : {
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

    await this.redis.setEx(cacheKey, 60 * 60 * 24 * 7, JSON.stringify(nutrient));
    return nutrient;
  }

  private validateDetections(
    detections: FoodDetection[],
    threshold: number = 0.5,
  ): {
    valid: boolean;
    errors: string[];
    normalizedDetections?: FoodDetection[];
  } {
    const errors: string[] = [];

    if (!detections || detections.length === 0) {
      errors.push('No food items detected');
      return { valid: false, errors };
    }

    for (let i = 0; i < detections.length; i++) {
      const detection = detections[i];

      if (detection.area_ratio <= 0 || detection.area_ratio > 1) {
        errors.push(
          `Detection ${i + 1} (${detection.class}): invalid area_ratio ${detection.area_ratio}`,
        );
      }

      if (detection.confidence < threshold) {
        errors.push(
          `Detection ${i + 1} (${detection.class}): low confidence ${detection.confidence} (min: ${threshold})`,
        );
      }
    }

    const sumRatio = detections.reduce((sum, d) => sum + d.area_ratio, 0);

    if (sumRatio <= 0) {
      errors.push('Invalid detection: empty area ratio');
    }

    let normalizedDetections = [...detections];

    if (detections.length === 1) {
      console.log(`Single food detected (${detections[0].class}), normalizing area_ratio to 1.0`);
      normalizedDetections = [
        {
          ...detections[0],
          area_ratio: 1.0,
        },
      ];
    } else if (sumRatio < 0.7 || sumRatio > 1.3) {
      console.log(`Total area_ratio ${sumRatio} is unrealistic, normalizing to 1.0`);
      normalizedDetections = detections.map((d) => ({
        ...d,
        area_ratio: d.area_ratio / sumRatio,
      }));
    }

    return {
      valid: errors.length === 0,
      errors,
      normalizedDetections,
    };
  }

  private async handleModelVersionChange(newVersion: string): Promise<void> {
    try {
      const activeModel = await prisma.mlModel.findFirst({
        where: { isActive: true },
        select: { version: true },
      });

      if (!activeModel) {
        console.warn('⚠️ No active ML model found in database');
        return;
      }

      if (activeModel.version === newVersion) {
        return;
      }

      console.log(` ML model version changed: ${activeModel.version} → ${newVersion}`);
      try {
        let cursor = '0';
        do {
          const { cursor: nextCursor, keys } = await this.redis.scan(cursor, {
            MATCH: 'ml:detect:*',
            COUNT: 100,
          });

          cursor = String(nextCursor);

          if (keys.length > 0) {
            await this.redis.del(keys);
            console.log(`   Deleted ${keys.length} inference cache entries`);
          }
        } while (cursor !== '0');
      } catch (redisError) {
        console.warn(
          ` Failed to invalidate inference cache: ${
            redisError instanceof Error ? redisError.message : redisError
          }`,
        );
      }
    } catch (error) {
      console.warn(
        ` handleModelVersionChange error: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  public async processDetectionsAndCalculateNutrition(
    totalWeightGram: number,
    detections: FoodDetection[],
    mlModelVersion: string,
    imageSize?: { width: number; height: number },
  ): Promise<ProcessedItem[]> {
    try {
      if (!totalWeightGram || totalWeightGram <= 0) {
        throw new Error('totalWeightGram must be > 0');
      }

      const validation = this.validateDetections(detections);
      if (!validation.valid) {
        throw new Error(`Detection validation failed: ${validation.errors.join('; ')}`);
      }

      await this.handleModelVersionChange(mlModelVersion);

      const finalDetections = validation.normalizedDetections || detections;

      const sumRatio = finalDetections.reduce((sum, d) => sum + d.area_ratio, 0);
      console.log(`Total area_ratio sum: ${sumRatio}`);

      const transformedDetections = this.transformDetections(finalDetections, imageSize);
      const processedItems: ProcessedItem[] = [];

      for (const detection of transformedDetections) {
        const itemWeightGram = Number((totalWeightGram * detection.area_ratio).toFixed(2));

        const nutrientPer100g = await this.getNutrientPer100g(detection.class);
        console.log(`  Nutrient per 100g:`, nutrientPer100g);

        const weightFactor = itemWeightGram / 100;
        const energyKcal =
          nutrientPer100g.energyKcal > 0
            ? Number((weightFactor * nutrientPer100g.energyKcal).toFixed(2))
            : 0;
        const proteinGram =
          nutrientPer100g.proteinGram > 0
            ? Number((weightFactor * nutrientPer100g.proteinGram).toFixed(2))
            : 0;
        const fatGram =
          nutrientPer100g.fatGram > 0
            ? Number((weightFactor * nutrientPer100g.fatGram).toFixed(2))
            : 0;
        const carbGram =
          nutrientPer100g.carbGram > 0
            ? Number((weightFactor * nutrientPer100g.carbGram).toFixed(2))
            : 0;
        const fiberGram =
          nutrientPer100g.fiberGram > 0
            ? Number((weightFactor * nutrientPer100g.fiberGram).toFixed(2))
            : 0;

        processedItems.push({
          id: uuidv4(),
          foodClassName: detection.class,
          mlConfidence: detection.confidence,
          areaRatio: detection.area_ratio,
          weightGram: itemWeightGram,
          energyKcal,
          proteinGram,
          fatGram,
          carbGram,
          fiberGram,
          calciumMg: 0,
          ironMg: 0,
          vitaminA: 0,
          vitaminC: 0,
          bboxData: detection.bboxData,
          metadata: {
            boundingBox: detection.bounding_box,
            nutrientSource: 'FoodClasses',
            formula: `(${itemWeightGram}g / 100) × nutrient_per_100g`,
            modelVersion: mlModelVersion,
            inferenceThreshold: 0.5,
            validationPassed: true,
            areaRatioValidated: detection.area_ratio > 0 && detection.area_ratio <= 1,
            areaRatioOriginal: detections.find((d) => d.class === detection.class)?.area_ratio,
            areaRatioSum: sumRatio,
            hasBoundingBox: !!detection.bboxData,
            weightCalculation: `${totalWeightGram}g × ${detection.area_ratio} = ${itemWeightGram}g`,
          },
        });
      }

      return processedItems;
    } catch (error) {
      console.error(' processDetectionsAndCalculateNutrition error:', error);
      throw error;
    }
  }

  public async saveToDatabase(
    childId: string,
    iotId: string | undefined,
    photoUrl: string | undefined,
    totalWeightGram: number,
    processedItems: ProcessedItem[],
    mlModelVersion: string,
    inferenceHash: string | undefined,
  ) {
    try {
      const foodClassNames = processedItems.map((item) => item.foodClassName);
      const uniqueClassNames = [...new Set(foodClassNames)];
      const title = uniqueClassNames.join(' + ');
      const finalTitle = title || 'Food Intake';

      const totals = {
        energyKcal: processedItems.reduce((sum, item) => sum + (item.energyKcal || 0), 0),
        proteinGram: processedItems.reduce((sum, item) => sum + (item.proteinGram || 0), 0),
        fatGram: processedItems.reduce((sum, item) => sum + (item.fatGram || 0), 0),
        carbGram: processedItems.reduce((sum, item) => sum + (item.carbGram || 0), 0),
        fiberGram: processedItems.reduce((sum, item) => sum + (item.fiberGram || 0), 0),
        calciumMg: processedItems.reduce((sum, item) => sum + (item.calciumMg || 0), 0),
        ironMg: processedItems.reduce((sum, item) => sum + (item.ironMg || 0), 0),
        vitaminA: processedItems.reduce((sum, item) => sum + (item.vitaminA || 0), 0),
        vitaminC: processedItems.reduce((sum, item) => sum + (item.vitaminC || 0), 0),
      };

      const result = await prisma.$transaction(async (tx) => {
        const foodIntake = await tx.food.create({
          data: {
            childId,
            iotId: iotId || null,
            photoUrl: photoUrl || null,
            totalWeightGram: new Prisma.Decimal(totalWeightGram),
            totals: toPrismaJson(totals),
            mlModelVersion,
            inferenceHash,
            title: finalTitle,
          },
        });

        const items = await Promise.all(
          processedItems.map((item) =>
            tx.foodIntakeItem.create({
              data: {
                id: item.id,
                foodIntakeId: foodIntake.id,
                foodClassName: item.foodClassName,
                mlConfidence: new Prisma.Decimal(item.mlConfidence),
                areaRatio: new Prisma.Decimal(item.areaRatio),
                bboxData: toPrismaJson(item.bboxData),
                weightGram: new Prisma.Decimal(item.weightGram),
                energyKcal: item.energyKcal > 0 ? new Prisma.Decimal(item.energyKcal) : null,
                proteinGram: item.proteinGram > 0 ? new Prisma.Decimal(item.proteinGram) : null,
                fatGram: item.fatGram > 0 ? new Prisma.Decimal(item.fatGram) : null,
                carbGram: item.carbGram > 0 ? new Prisma.Decimal(item.carbGram) : null,
                fiberGram: item.fiberGram > 0 ? new Prisma.Decimal(item.fiberGram) : null,
                calciumMg: item.calciumMg > 0 ? new Prisma.Decimal(item.calciumMg) : null,
                ironMg: item.ironMg > 0 ? new Prisma.Decimal(item.ironMg) : null,
                vitaminA: item.vitaminA > 0 ? new Prisma.Decimal(item.vitaminA) : null,
                vitaminC: item.vitaminC > 0 ? new Prisma.Decimal(item.vitaminC) : null,
                metadata: toPrismaJson(item.metadata),
              },
            }),
          ),
        );

        return { foodIntake, items };
      });

      if (result.foodIntake.createdAt) {
        await foodIntakeSummaryService.invalidateDailySummaryCache(
          childId,
          result.foodIntake.createdAt,
        );
      }

      return result;
    } catch (error) {
      console.error(' saveToDatabase error:', error);
      throw new Error(
        `Failed to save food intake: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  public async getFoodIntakeWithBoundingBox(foodIntakeId: string) {
    try {
      const foodIntake = await prisma.food.findUnique({
        where: { id: foodIntakeId },
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
              fullName: true,
            },
          },
        },
      });

      if (!foodIntake) {
        throw new Error('Food intake not found');
      }

      // Convert Prisma Json values back
      const itemsWithBbox = foodIntake.items.map((item) => ({
        ...item,
        bboxData: fromPrismaJson(item.bboxData),
        metadata: fromPrismaJson(item.metadata),
      }));

      return {
        ...foodIntake,
        items: itemsWithBbox,
      };
    } catch (error) {
      console.error('getFoodIntakeWithBoundingBox error:', error);
      throw error;
    }
  }

  public async getItemsForVisualization(foodIntakeId: string) {
    try {
      const items = await prisma.foodIntakeItem.findMany({
        where: { foodIntakeId },
        select: {
          id: true,
          foodClassName: true,
          mlConfidence: true,
          weightGram: true,
          bboxData: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      return items.map((item) => {
        const bboxData = fromPrismaJson(item.bboxData);

        return {
          ...item,
          mlConfidence: Number(item.mlConfidence),
          weightGram: Number(item.weightGram),
          visualizationData: bboxData
            ? {
                label: item.foodClassName,
                confidence: `${(Number(item.mlConfidence) * 100).toFixed(1)}%`,
                weight: `${Number(item.weightGram).toFixed(1)}g`,
                bbox: bboxData,
              }
            : null,
        };
      });
    } catch (error) {
      console.error('getItemsForVisualization error:', error);
      throw error;
    }
  }
}

export default new FoodIntakeService();
