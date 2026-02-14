import prisma from 'prisma/client';
import { FoodIntakeDailySummary, FoodIntakeDailySummaryItem } from '@/types/foodIntake.types';
import { getAgeInMonths } from '@/utils/age';
import { getBaseEnergyKcal, getEnergyCorrectionFactor } from '@/utils/energyTarget.util';
import { GrowthClassification, GrowthRecommendation } from '@/types/who.types';
import { parsePrismaJson } from '@/utils/prisma.json';
import { NutritionStatus } from '@prisma/client';
import { getMacroTargets } from '@/utils/akg';

class FoodIntakeSummaryService {
  public async getDailySummary(childId: string, date: Date, skipCache = false) {
    const dateStr = date.toISOString().split('T')[0];
    if (skipCache) {
      console.warn(` Cache bypassed for daily-summary:${childId}:${dateStr} (debug mode)`);
    }

    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: {
        id: true,
        dateOfBirth: true,
      },
    });

    if (!child) throw new Error('Child not found');

    const ageMonths = getAgeInMonths(child.dateOfBirth, date);

    if (ageMonths === 0) {
      console.warn(`⚠️ Age calculated as 0 for child ${childId} with DOB: ${child.dateOfBirth}`);
    }

    const lastEvaluation = await prisma.whoEvaluation.findFirst({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });

    const classification = parsePrismaJson<GrowthClassification>(lastEvaluation?.classification);
    const recommendation = parsePrismaJson<GrowthRecommendation>(lastEvaluation?.recommendation);

    if (lastEvaluation && (!classification || !recommendation)) {
      console.warn(`⚠️ WHO data found but failed to parse for child ${childId}`, {
        classificationRaw: lastEvaluation.classification,
        recommendationRaw: lastEvaluation.recommendation,
      });
    }

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
      calciumMg: 0,
      ironMg: 0,
      vitaminA: 0,
      vitaminC: 0,
    };

    const items: FoodIntakeDailySummaryItem[] = [];

    for (const intake of foodIntakes) {
      for (const item of intake.items) {
        totals.energyKcal += Number(item.energyKcal ?? 0);
        totals.proteinGram += Number(item.proteinGram ?? 0);
        totals.fatGram += Number(item.fatGram ?? 0);
        totals.carbGram += Number(item.carbGram ?? 0);
        totals.fiberGram += Number(item.fiberGram ?? 0);
        totals.calciumMg += Number(item.calciumMg ?? 0);
        totals.ironMg += Number(item.ironMg ?? 0);
        totals.vitaminA += Number(item.vitaminA ?? 0);
        totals.vitaminC += Number(item.vitaminC ?? 0);

        items.push({
          foodClassName: item.foodClassName,
          weightGram: Number(item.weightGram ?? 0),
          mlConfidence: Number(item.mlConfidence ?? 0),
          energyKcal: Number(item.energyKcal ?? 0),
          proteinGram: Number(item.proteinGram ?? 0),
          fatGram: Number(item.fatGram ?? 0),
          carbGram: Number(item.carbGram ?? 0),
          fiberGram: Number(item.fiberGram ?? 0),
          calciumMg: Number(item.calciumMg ?? 0),
          ironMg: Number(item.ironMg ?? 0),
          vitaminA: Number(item.vitaminA ?? 0),
          vitaminC: Number(item.vitaminC ?? 0),
          timestamp: item.createdAt ?? intake.createdAt,
        });
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
      totalIntakes: foodIntakes.length,
      items,
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

    return result;
  }

  public async invalidateDailySummaryCache(childId: string, date: string | Date): Promise<void> {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const dateStr = dateObj.toISOString().split('T')[0];
      console.log(`ℹ Cache disabled: skip invalidation for daily-summary:${childId}:${dateStr}`);
    } catch (error) {
      console.warn(` Failed to handle cache invalidation:`, error);
    }
  }

  public async flushAllChildCache(childId: string): Promise<number> {
    try {
      console.log(`ℹ Cache disabled: skip flush for child ${childId}`);
      return 0;
    } catch (error) {
      console.warn(` Failed to flush cache for child ${childId}:`, error);
      return 0;
    }
  }

  public async getDateRangeSummary(
    childId: string,
    startDate: string | Date,
    endDate: string | Date,
    skipCache = false,
  ): Promise<FoodIntakeDailySummary[]> {
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

      const summaries: FoodIntakeDailySummary[] = [];

      const current = new Date(start);
      while (current <= end) {
        const summary = await this.getDailySummary(childId, new Date(current), skipCache);
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
