import { AppContext } from '@/contex/appContex';
import modelsController from '@/controllers/modelsController';
import { requireRole, verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class ModelsRouter {
  public modelsRoutes;
  constructor() {
    this.modelsRoutes = new Elysia({ prefix: '/models' }).derive(() => ({
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
    this.modelsRoutes.post('/', (c: AppContext) => modelsController.PostModelsVersion(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['ADMIN']).beforeHandle],
    });
    this.modelsRoutes.get('/', (c: AppContext) => modelsController.getModels(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
  }
}

export default new ModelsRouter().modelsRoutes;
