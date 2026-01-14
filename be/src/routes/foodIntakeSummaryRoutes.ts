import { Elysia } from 'elysia';
import { verifyToken, requireRole } from '@/middlewares/auth';
import foodIntakeSummaryController from '@/controllers/FoodIntakeSummaryController';

/**
 * Food Intake Summary Routes
 *
 * GET /api/food/intake/daily/:childId
 * GET /api/food/intake/range/:childId
 *
 * Both are READ-ONLY endpoints
 * No modifications to POST /intake logic
 */

class FoodIntakeSummaryRoutes {
  public route() {
    return new Elysia({ prefix: '/food/intake' })
      .get('/daily/:childId', (c: any) => foodIntakeSummaryController.getDailySummary(c), {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'KADER', 'POSYANDU']).beforeHandle,
        ],
      })
      .get('/range/:childId', (c: any) => foodIntakeSummaryController.getDateRangeSummary(c), {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'KADER', 'POSYANDU']).beforeHandle,
        ],
      });
  }
}

export default new FoodIntakeSummaryRoutes().route();
