import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import { FoodIntakeDailySummary, FoodIntakeDailySummaryItem } from '@/types/foodIntake.types';

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

  /**
   * Get daily summary for a child
   * Aggregates all food intakes for a given day across items
   *
   * @param childId - UUID of child
   * @param date - Date to get summary for (ISO string or Date object)
   * @returns {FoodIntakeDailySummary} Daily summary with totals
   */
  public async getDailySummary(
    childId: string,
    date: string | Date,
  ): Promise<FoodIntakeDailySummary> {
    try {
      // Normalize date to ISO string for cache key
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const cacheKey = `summary:daily:${childId}:${dateStr}`;

      // Check Redis cache first (TTL: 24 hours)
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (redisError) {
        console.warn(`⚠️ Redis read failed for ${cacheKey}:`, redisError);
        // Fall through to database query
      }

      // Calculate date range (start of day to end of day)
      const dayStart = new Date(dateStr);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dateStr);
      dayEnd.setHours(23, 59, 59, 999);

      // Query all food intakes for this child on this date
      const foodIntakes = await prisma.food.findMany({
        where: {
          childId,
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Aggregate totals across all items
      const summary: FoodIntakeDailySummary = {
        childId,
        date: dateStr,
        totalIntakes: foodIntakes.length,
        items: [],
        totals: {
          energyKcal: 0,
          proteinGram: 0,
          fatGram: 0,
          carbGram: 0,
          fiberGram: 0,
          calciumMg: 0,
          ironMg: 0,
          vitaminA: 0,
          vitaminC: 0,
        },
      };

      // Iterate through all food intakes and items
      for (const foodIntake of foodIntakes) {
        for (const item of foodIntake.items) {
          // Add individual item to summary
          const summaryItem: FoodIntakeDailySummaryItem = {
            foodClassName: item.foodClassName,
            weightGram: Number(item.weightGram),
            mlConfidence: Number(item.mlConfidence),
            energyKcal: item.energyKcal ? Number(item.energyKcal) : 0,
            proteinGram: item.proteinGram ? Number(item.proteinGram) : 0,
            fatGram: item.fatGram ? Number(item.fatGram) : 0,
            carbGram: item.carbGram ? Number(item.carbGram) : 0,
            fiberGram: item.fiberGram ? Number(item.fiberGram) : 0,
            calciumMg: item.calciumMg ? Number(item.calciumMg) : 0,
            ironMg: item.ironMg ? Number(item.ironMg) : 0,
            vitaminA: item.vitaminA ? Number(item.vitaminA) : 0,
            vitaminC: item.vitaminC ? Number(item.vitaminC) : 0,
            timestamp: item.createdAt,
          };

          summary.items.push(summaryItem);

          // Add to totals
          summary.totals.energyKcal += summaryItem.energyKcal;
          summary.totals.proteinGram += summaryItem.proteinGram;
          summary.totals.fatGram += summaryItem.fatGram;
          summary.totals.carbGram += summaryItem.carbGram;
          summary.totals.fiberGram += summaryItem.fiberGram;
          summary.totals.calciumMg += summaryItem.calciumMg;
          summary.totals.ironMg += summaryItem.ironMg;
          summary.totals.vitaminA += summaryItem.vitaminA;
          summary.totals.vitaminC += summaryItem.vitaminC;
        }
      }

      // Round totals to 2 decimal places
      summary.totals = {
        energyKcal: Math.round(summary.totals.energyKcal * 100) / 100,
        proteinGram: Math.round(summary.totals.proteinGram * 100) / 100,
        fatGram: Math.round(summary.totals.fatGram * 100) / 100,
        carbGram: Math.round(summary.totals.carbGram * 100) / 100,
        fiberGram: Math.round(summary.totals.fiberGram * 100) / 100,
        calciumMg: Math.round(summary.totals.calciumMg * 100) / 100,
        ironMg: Math.round(summary.totals.ironMg * 100) / 100,
        vitaminA: Math.round(summary.totals.vitaminA * 100) / 100,
        vitaminC: Math.round(summary.totals.vitaminC * 100) / 100,
      };

      // Cache result in Redis (TTL: 24 hours)
      try {
        await this.redis.setEx(cacheKey, 86400, JSON.stringify(summary));
      } catch (redisError) {
        console.warn(`⚠️ Redis write failed for ${cacheKey}:`, redisError);
        // Continue - cache failure is non-blocking
      }

      return summary;
    } catch (error) {
      console.error('❌ getDailySummary error:', error);
      throw new Error(
        `Failed to get daily summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Invalidate daily summary cache when new food intake is saved
   * Called by FoodIntakeService after successful POST /intake
   *
   * @param childId - UUID of child
   * @param date - Date of food intake
   */
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

      // Generate date range
      const current = new Date(start);
      while (current <= end) {
        const summary = await this.getDailySummary(childId, new Date(current));
        summaries.push(summary);

        // Move to next day
        current.setDate(current.getDate() + 1);
      }

      return summaries;
    } catch (error) {
      console.error('❌ getDateRangeSummary error:', error);
      throw new Error(
        `Failed to get date range summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export default new FoodIntakeSummaryService();
