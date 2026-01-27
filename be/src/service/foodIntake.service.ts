import { AxiosService } from '@/utils/axios';
import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import crypto from 'crypto';
import { FoodDetection } from '@/types/foodIntake.types';
import { Prisma } from '@prisma/client';
import { cacheKeys } from '@/cache/cacheKey';
import foodIntakeSummaryService from './foodIntakeSummary.service';
import FormData from 'form-data';
/**
 * FoodIntakeService
 *
 * Responsibilities:
 * 1. Call ML API (FastAPI) untuk inference YOLO
 * 2. Distribute berat makanan: item_weight = total_weight × area_ratio
 * 3. Lookup nutrisi dari FoodClasses (per 100g)
 * 4. Calculate nutrisi aktual: nutrient = (item_weight / 100) × nutrient_per_100g
 * 5. Save ke database dengan transaction
 * 6. Cache inference & nutrient lookups di Redis
 */

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

  /**
   * Inference: Upload image ke ML service & dapatkan detections
   *
   * Flow:
   * 1. Generate image hash (untuk cache key)
   * 2. Check Redis cache (ml:detect:{hash}) - TTL 24 jam
   * 3. Jika cache miss, hit FastAPI /detect endpoint
   * 4. Save ke Redis dengan TTL
   * 5. Return detections
   */
  public async inferenceYolo(imageBuffer: Buffer): Promise<FoodDetection[]> {
    try {
      const imageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
      const cacheKey = cacheKeys.models.detect(imageHash);

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

      const detections: FoodDetection[] = response.data.detections;

      await this.redis.setEx(cacheKey, 86400, JSON.stringify(detections));
      return detections;
    } catch (err) {
      throw new Error(`Inference failed: ${err}`);
    }
  }

  /**
   * Lookup nutrisi dari FoodClasses
   *
   * Flow:
   * 1. Check Redis cache (nutrient:{food_class}) - TTL 7 hari
   * 2. Jika cache miss, query database
   * 3. Save ke Redis
   * 4. Return nutrient per 100g
   */
  private async getNutrientPer100g(foodClassName: string) {
    const cacheKey = `nutrient:${foodClassName}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const foodClass = await prisma.foodClasses.findUnique({
      where: { name: foodClassName },
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

  /**
   * Validate detections for quality & consistency
   *
   * Rules:
   * 1. area_ratio > 0 untuk setiap item
   * 2. sum(area_ratio) ≈ 1.0 (tolerance ±0.15, allow slight background)
   * 3. min confidence threshold: 0.5
   * 4. At least 1 detection required
   */
  private validateDetections(
    detections: FoodDetection[],
    threshold: number = 0.5,
  ): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check minimum detections
    if (!detections || detections.length === 0) {
      errors.push('No food items detected');
      return { valid: false, errors };
    }

    // Check individual area ratios
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

    // Check sum of area ratios (tolerance: ±0.15 for background/overlap)
    const sumRatio = detections.reduce((sum, d) => sum + d.area_ratio, 0);
    const tolerance = 0.15;
    const minSum = 1.0 - tolerance;
    const maxSum = 1.0 + tolerance;

    if (sumRatio < minSum || sumRatio > maxSum) {
      errors.push(
        `Area ratio sum ${sumRatio.toFixed(2)} outside tolerance [${minSum.toFixed(2)}, ${maxSum.toFixed(2)}]`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if model version changed & invalidate cache if needed
   */
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

  /**
   * Process detections & calculate actual nutrition per item
   *
   * Formula:
   * weight_item = total_weight × area_ratio
   * nutrient_actual = (weight_item / 100) × nutrient_per_100g
   *
   * Contoh:
   * Total: 300g
   * Nasi: area_ratio = 0.50 → weight = 150g → energy = (150/100) × 184 = 276 kcal
   */
  public async processDetectionsAndCalculateNutrition(
    totalWeightGram: number,
    detections: FoodDetection[],
    mlModelVersion: string,
  ) {
    try {
      if (!totalWeightGram || totalWeightGram <= 0) {
        throw new Error('totalWeightGram must be > 0');
      }
      const validation = this.validateDetections(detections);
      if (!validation.valid) {
        throw new Error(`Detection validation failed: ${validation.errors.join('; ')}`);
      }
      await this.handleModelVersionChange(mlModelVersion);

      const processedItems = [];

      for (const detection of detections) {
        const itemWeightGram = Number((totalWeightGram * detection.area_ratio).toFixed(2));

        // Lookup nutrition per 100g
        const nutrientPer100g = await this.getNutrientPer100g(detection.class);

        // Calculate actual nutrition
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
          metadata: {
            boundingBox: detection.bounding_box,
            nutrientSource: 'FoodClasses',
            formula: `(${itemWeightGram}g / 100) × nutrient_per_100g`,
            modelVersion: mlModelVersion,
            inferenceThreshold: 0.5,
            validationPassed: true,
            areaRatioValidated: detection.area_ratio > 0 && detection.area_ratio <= 1,
          },
        });
      }

      return processedItems;
    } catch (error) {
      console.error(' processDetectionsAndCalculateNutrition error:', error);
      throw error;
    }
  }

  /**
   * Save Food Intake to database (atomic transaction)
   *
   * Creates:
   * 1. Food record (parent)
   * 2. FoodIntakeItem records (children)
   */
  public async saveToDatabase(
    childId: string,
    iotId: string | undefined,
    photoUrl: string | undefined,
    totalWeightGram: number,
    processedItems: any[],
    mlModelVersion: string,
    inferenceHash: string | undefined,
  ) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const foodIntake = await tx.food.create({
          data: {
            childId,
            iotId: iotId || null,
            photoUrl: photoUrl || null,
            totalWeightGram: new Prisma.Decimal(totalWeightGram),
            mlModelVersion,
            inferenceHash,
          },
        });

        const items = await Promise.all(
          processedItems.map((item) =>
            tx.foodIntakeItem.create({
              data: {
                foodIntakeId: foodIntake.id,
                foodClassName: item.foodClassName,
                mlConfidence: new Prisma.Decimal(item.mlConfidence),
                areaRatio: new Prisma.Decimal(item.areaRatio),
                weightGram: new Prisma.Decimal(item.weightGram),
                energyKcal: item.energyKcal > 0 ? new Prisma.Decimal(item.energyKcal) : null,
                proteinGram: item.proteinGram > 0 ? new Prisma.Decimal(item.proteinGram) : null,
                fatGram: item.fatGram > 0 ? new Prisma.Decimal(item.fatGram) : null,
                carbGram: item.carbGram > 0 ? new Prisma.Decimal(item.carbGram) : null,
                fiberGram: item.fiberGram > 0 ? new Prisma.Decimal(item.fiberGram) : null,
                calciumMg: null,
                ironMg: null,
                vitaminA: null,
                vitaminC: null,
                metadata: item.metadata,
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
}

export default new FoodIntakeService();
