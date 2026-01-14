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
}

export default new FoodIntakeSummaryController();
