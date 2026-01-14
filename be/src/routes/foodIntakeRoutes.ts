import Elysia from 'elysia';
import FoodIntakeController from '@/controllers/FoodIntakeController';
import { AppContext } from '@/contex/appContex';
import { requireRole, verifyToken } from '@/middlewares/auth';

class FoodIntakeRoutes {
  public foodIntakeRoutes;
  constructor() {
    this.foodIntakeRoutes = new Elysia({ prefix: '/food' }).derive(() => ({
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
    this.foodIntakeRoutes.post(
      '/intake',
      (c: AppContext) => FoodIntakeController.createFoodIntake(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'KADER', 'POSYANDU']).beforeHandle,
        ],
      },
    );
  }
}

export default new FoodIntakeRoutes().foodIntakeRoutes;
