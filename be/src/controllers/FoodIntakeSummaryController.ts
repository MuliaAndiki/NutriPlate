import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import foodIntakeSummaryService from '@/service/foodIntakeSummary.service';
import prisma from 'prisma/client';

class FoodIntakeSummaryController {
  /**
   * GET /api/food/intake/daily/:childId
   *
   * Get daily food intake summary for a child
   * Query params: date (optional, defaults to today)
   *
   * Response: FoodIntakeDailySummary
   */
  public async getDailySummary(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as { childId: string };
      const query = c.query as { date?: string };

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.childId) {
        return c.json?.({ status: 400, message: 'childId param is required' }, 400);
      }

      const child = await prisma.child.findUnique({
        where: { id: params.childId },
        select: {
          id: true,
          parentId: true,
          posyanduId: true,
        },
      });

      if (!child) {
        return c.json?.({ status: 404, message: 'Child not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden: Cannot access this child' }, 403);
      }

      let targetDate = new Date();
      if (query?.date) {
        const parsedDate = new Date(query.date);
        if (isNaN(parsedDate.getTime())) {
          return c.json?.(
            { status: 400, message: 'Invalid date format. Use YYYY-MM-DD or ISO string.' },
            400,
          );
        }
        targetDate = parsedDate;
      }

      const summary = await foodIntakeSummaryService.getDailySummary(params.childId, targetDate);

      return c.json?.(
        {
          status: 200,
          message: 'Daily summary retrieved successfully',
          data: summary,
        },
        200,
      );
    } catch (error) {
      console.error('getDailySummary error:', error);
      return c.json?.(
        {
          status: 500,
          message: 'Failed to get daily summary',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
    }
  }

  /**
   * GET /api/food/intake/range/:childId
   *
   * Get food intake summary for a date range
   * Query params: startDate, endDate (required)
   *
   * Response: Array<FoodIntakeDailySummary>
   */
  public async getDateRangeSummary(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as { childId: string };
      const query = c.query as { startDate?: string; endDate?: string };

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.childId) {
        return c.json?.({ status: 400, message: 'childId param is required' }, 400);
      }

      if (!query?.startDate || !query?.endDate) {
        return c.json?.(
          { status: 400, message: 'startDate and endDate query params are required' },
          400,
        );
      }

      const child = await prisma.child.findUnique({
        where: { id: params.childId },
        select: {
          id: true,
          parentId: true,
          posyanduId: true,
        },
      });

      if (!child) {
        return c.json?.({ status: 404, message: 'Child not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden: Cannot access this child' }, 403);
      }

      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return c.json?.(
          { status: 400, message: 'Invalid date format. Use YYYY-MM-DD or ISO string.' },
          400,
        );
      }

      if (startDate > endDate) {
        return c.json?.(
          { status: 400, message: 'startDate must be before or equal to endDate' },
          400,
        );
      }

      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 90) {
        return c.json?.({ status: 400, message: 'Date range cannot exceed 90 days' }, 400);
      }

      const summaries = await foodIntakeSummaryService.getDateRangeSummary(
        params.childId,
        startDate,
        endDate,
      );

      return c.json?.(
        {
          status: 200,
          message: 'Date range summary retrieved successfully',
          data: {
            childId: params.childId,
            startDate: query.startDate,
            endDate: query.endDate,
            dayCount: summaries.length,
            summaries,
          },
        },
        200,
      );
    } catch (error) {
      console.error(' getDateRangeSummary error:', error);
      return c.json?.(
        {
          status: 500,
          message: 'Failed to get date range summary',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
    }
  }

  /**
   * GET /api/food/intake/daily/:childId/with-tasks
   *
   * Get daily food intake summary combined with daily meal tasks
   * Query params: date (optional, defaults to today)
   *
   * Response: Daily summary with meal tasks breakdown
   */
  public async getDailySummaryWithTasks(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as { childId: string };
      const query = c.query as { date?: string };

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.childId) {
        return c.json?.({ status: 400, message: 'childId param is required' }, 400);
      }

      const child = await prisma.child.findUnique({
        where: { id: params.childId },
        select: { id: true, parentId: true, posyanduId: true },
      });

      if (!child) {
        return c.json?.({ status: 404, message: 'Child not found' }, 404);
      }

      if (jwtUser.role === 'PARENT' && child.parentId !== jwtUser.id) {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      let targetDate = new Date();
      if (query?.date) {
        const parsedDate = new Date(query.date);
        if (isNaN(parsedDate.getTime())) {
          return c.json?.({ status: 400, message: 'Invalid date format' }, 400);
        }
        targetDate = parsedDate;
      }

      const dailySummary = await foodIntakeSummaryService.getDailySummary(
        params.childId,
        targetDate,
      );

      const dateStr = targetDate.toISOString().split('T')[0];
      const dayStart = new Date(dateStr);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dateStr);
      dayEnd.setHours(23, 59, 59, 999);

      // Get meal tasks with target nutrition
      const mealTasks = await prisma.taskProgram.findMany({
        where: {
          progres: { child: { id: params.childId } },
          createdAt: { gte: dayStart, lte: dayEnd },
          mealType: { not: null },
        },
        include: {
          progres: {
            select: { program: { select: { id: true, name: true } } },
          },
        },
        orderBy: [{ mealType: 'asc' }, { createdAt: 'asc' }],
      });

      const mealNutrition = await this.getMealNutritionBreakdown(params.childId, dayStart, dayEnd);

      const mealsWithData = mealTasks.map((task) => {
        const actualNutrition = mealNutrition.get(task.mealType || 'OTHER') || {
          energyKcal: 0,
          proteinGram: 0,
          fatGram: 0,
          carbGram: 0,
          fiberGram: 0,
        };

        return {
          taskId: task.id,
          mealType: task.mealType,
          title: task.title,
          description: task.description,
          isCompleted: task.isComplated,
          programName: task.progres.program.name,
          createdAt: task.createdAt,
          targetNutrition: {
            energyKcal: task.targetEnergyKcal || 0,
            proteinGram: task.targetProteinGram || 0,
            fatGram: task.targetFatGram || 0,
            carbGram: task.targetCarbGram || 0,
            fiberGram: task.targetFiberGram || 0,
          },
          actualNutrition,
          gap: {
            energyKcal: (task.targetEnergyKcal || 0) - actualNutrition.energyKcal,
            proteinGram: (task.targetProteinGram || 0) - actualNutrition.proteinGram,
            fatGram: (task.targetFatGram || 0) - actualNutrition.fatGram,
            carbGram: (task.targetCarbGram || 0) - actualNutrition.carbGram,
            fiberGram: (task.targetFiberGram || 0) - actualNutrition.fiberGram,
          },
        };
      });

      return c.json?.(
        {
          status: 200,
          message: 'Daily summary with tasks retrieved successfully',
          data: {
            ...dailySummary,
            meals: mealsWithData,
          },
        },
        200,
      );
    } catch (error) {
      console.error('getDailySummaryWithTasks error:', error);
      return c.json?.(
        {
          status: 500,
          message: 'Failed to get daily summary with tasks',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
    }
  }

  /**
   * Helper: Get nutrition breakdown by meal type
   */
  private async getMealNutritionBreakdown(
    childId: string,
    dayStart: Date,
    dayEnd: Date,
  ): Promise<Map<string, any>> {
    const mealNutrition = new Map<string, any>();

    const foodIntakes = await prisma.food.findMany({
      where: { childId, createdAt: { gte: dayStart, lte: dayEnd } },
      include: { items: true },
    });

    foodIntakes.forEach((intake) => {
      const mealType = this.determineMealTypeFromTime(intake.createdAt);

      if (!mealNutrition.has(mealType)) {
        mealNutrition.set(mealType, {
          energyKcal: 0,
          proteinGram: 0,
          fatGram: 0,
          carbGram: 0,
          fiberGram: 0,
        });
      }

      const meal = mealNutrition.get(mealType);
      intake.items.forEach((item) => {
        meal.energyKcal += Number(item.energyKcal ?? 0);
        meal.proteinGram += Number(item.proteinGram ?? 0);
        meal.fatGram += Number(item.fatGram ?? 0);
        meal.carbGram += Number(item.carbGram ?? 0);
        meal.fiberGram += Number(item.fiberGram ?? 0);
      });

      Object.keys(meal).forEach((k) => {
        meal[k] = Math.round(meal[k] * 100) / 100;
      });
    });

    return mealNutrition;
  }

  /**
   * Helper: Determine meal type from time of day
   */
  private determineMealTypeFromTime(time: Date): string {
    const hour = time.getHours();
    if (hour >= 5 && hour < 10) return 'BREAKFAST';
    if (hour >= 10 && hour < 14) return 'LUNCH';
    if (hour >= 14 && hour < 18) return 'SNACK';
    return 'DINNER';
  }
}

export default new FoodIntakeSummaryController();
