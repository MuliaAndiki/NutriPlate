import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import { FoodIntakeDailySummary } from '@/types/foodIntake.types';
import { getAgeInMonths } from '@/utils/age';
import { getBaseEnergyKcal, getEnergyCorrectionFactor } from '@/utils/energyTarget.util';
import { GrowthClassification, GrowthRecommendation } from '@/types/who.types';
import { parsePrismaJson } from '@/utils/prisma.json';
import { NutritionStatus } from '@prisma/client';
import { getMacroTargets } from '@/utils/akg';
/**
 * FoodIntakeSummaryService
 *
 * Responsibilities:
 * 1. Calculate daily food intake totals (read-only)
 * 2. Aggregate nutrition across all items
 * 3. Cache results in Redis (24h TTL)
 * 4. NO WRITES to database
 * 5. NO MODIFICATION of POST /intake logic
 */

class FoodIntakeSummaryService {
  private redis;

  constructor() {
    this.redis = getRedis();
  }

  public async getDailySummary(childId: string, date: Date) {
    const redis = getRedis();
    const dateStr = date.toISOString().split('T')[0];
    const cacheKey = `daily-summary:${childId}:${dateStr}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: {
        id: true,
        dateOfBirth: true,
      },
    });

    if (!child) throw new Error('Child not found');

    const ageMonths = getAgeInMonths(child.dateOfBirth, date);

    const lastEvaluation = await prisma.whoEvaluation.findFirst({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });

    const classification = parsePrismaJson<GrowthClassification>(lastEvaluation?.classification);

    const recommendation = parsePrismaJson<GrowthRecommendation>(lastEvaluation?.recommendation);

    const lastMeasurement = await prisma.measurement.findFirst({
      where: { childId },
      orderBy: { measurementDate: 'desc' },
      select: { nutritionStatus: true },
    });

    const nutritionStatus: NutritionStatus =
      lastMeasurement?.nutritionStatus ?? NutritionStatus.normal;

    const dayStart = new Date(dateStr);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dateStr);
    dayEnd.setHours(23, 59, 59, 999);

    const foodIntakes = await prisma.food.findMany({
      where: {
        childId,
        createdAt: { gte: dayStart, lte: dayEnd },
      },
      include: { items: true },
    });

    const totals = {
      energyKcal: 0,
      proteinGram: 0,
      fatGram: 0,
      carbGram: 0,
      fiberGram: 0,
    };

    for (const intake of foodIntakes) {
      for (const item of intake.items) {
        totals.energyKcal += Number(item.energyKcal ?? 0);
        totals.proteinGram += Number(item.proteinGram ?? 0);
        totals.fatGram += Number(item.fatGram ?? 0);
        totals.carbGram += Number(item.carbGram ?? 0);
        totals.fiberGram += Number(item.fiberGram ?? 0);
      }
    }

    Object.keys(totals).forEach(
      (k) => ((totals as any)[k] = Math.round((totals as any)[k] * 100) / 100),
    );

    const baseEnergyKcal = getBaseEnergyKcal(ageMonths);

    const macroTarget = getMacroTargets(ageMonths);

    const correctionFactor = getEnergyCorrectionFactor(nutritionStatus);

    const targetEnergyKcal = Math.round(baseEnergyKcal * correctionFactor);

    const energyPercent = Math.min(Math.round((totals.energyKcal / targetEnergyKcal) * 100), 100);

    const status = energyPercent >= 90 ? 'GOOD' : energyPercent >= 70 ? 'ENOUGH' : 'LOW';

    const result = {
      childId,
      date: dateStr,
      ageMonths,

      who: classification
        ? {
            stuntingStatus: classification.stuntingStatus,
            severity: classification.severity,
            zScore: lastEvaluation?.zScore ?? null,
            riskLevel: recommendation?.riskLevel ?? 'NORMAL',
          }
        : null,

      totals,

      target: {
        energyKcal: targetEnergyKcal,
        baseEnergyKcal,
        correctionFactor,
        nutritionStatus,

        macro: {
          proteinGram: macroTarget.proteinGram,
          carbGram: macroTarget.carbGram,
          fatGram: macroTarget.fatGram,
          fiberGram: macroTarget.fiberGram,
          source: macroTarget.source,
          referenceAgeMonths: macroTarget.referenceAgeMonths,
        },
      },

      progress: {
        energyPercent,
        status,
      },
    };

    await redis.setEx(cacheKey, 86400, JSON.stringify(result));
    return result;
  }

  public async invalidateDailySummaryCache(childId: string, date: string | Date): Promise<void> {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const dateStr = dateObj.toISOString().split('T')[0];
      const cacheKey = `summary:daily:${childId}:${dateStr}`;

      await this.redis.del(cacheKey);
      console.log(`✓ Invalidated cache: ${cacheKey}`);
    } catch (error) {
      console.warn(`⚠️ Failed to invalidate cache:`, error);
      // Non-blocking
    }
  }

  /**
   * Get summary for multiple days (useful for trends)
   *
   * @param childId - UUID of child
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns {Array<FoodIntakeDailySummary>} Array of daily summaries
   */
  public async getDateRangeSummary(
    childId: string,
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<FoodIntakeDailySummary[]> {
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

      const summaries: FoodIntakeDailySummary[] = [];

      const current = new Date(start);
      while (current <= end) {
        const summary = await this.getDailySummary(childId, new Date(current));
        summaries.push(summary);

        current.setDate(current.getDate() + 1);
      }

      return summaries;
    } catch (error) {
      console.error(' getDateRangeSummary error:', error);
      throw new Error(
        `Failed to get date range summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export default new FoodIntakeSummaryService();
