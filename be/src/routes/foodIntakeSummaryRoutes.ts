import { Elysia } from 'elysia';
import { verifyToken, requireRole } from '@/middlewares/auth';
import foodIntakeSummaryController from '@/controllers/FoodIntakeSummaryController';
import { AppContext } from '@/contex/appContex';

class FoodIntakeSummaryRoutes {
  public foodIntakeSummaryRoutes;

  constructor() {
    this.foodIntakeSummaryRoutes = new Elysia({ prefix: '/food/intake' }).derive(() => ({
      json(data: any, status = 200) {
        return new Response(JSON.stringify(data), {
          status,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    }));
    this.routes();
  }
  private routes() {
    this.foodIntakeSummaryRoutes.get(
      '/daily/:childId',
      (c: AppContext) => foodIntakeSummaryController.getDailySummary(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'KADER', 'POSYANDU', 'ADMIN']).beforeHandle,
        ],
      },
    );
    this.foodIntakeSummaryRoutes.get(
      '/daily/:childId/with-tasks',
      (c: AppContext) => foodIntakeSummaryController.getDailySummaryWithTasks(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'KADER', 'POSYANDU', 'ADMIN']).beforeHandle,
        ],
      },
    );
    this.foodIntakeSummaryRoutes.get(
      '/range/:childId',
      (c: AppContext) => foodIntakeSummaryController.getDateRangeSummary(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'KADER', 'POSYANDU', 'ADMIN']).beforeHandle,
        ],
      },
    );
    this.foodIntakeSummaryRoutes.get(
      '/clases',
      (c: AppContext) => foodIntakeSummaryController.getAllFoodClasses(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
  }
}

export default new FoodIntakeSummaryRoutes().foodIntakeSummaryRoutes;
