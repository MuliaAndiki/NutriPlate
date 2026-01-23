import Elysia from 'elysia';
import ChildController from '@/controllers/ChildController';
import { AppContext } from '@/contex/appContex';
import { requireRole, verifyToken } from '@/middlewares/auth';

class ChildRoutes {
  public childRoutes;
  constructor() {
    this.childRoutes = new Elysia({ prefix: '/child' }).derive(() => ({
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
    this.childRoutes.post('/', (c: AppContext) => ChildController.createChild(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
    });

    this.childRoutes.patch('/cancel/:id', (c: AppContext) => ChildController.cancelRegister(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
    });

    this.childRoutes.put('/:id', (c: AppContext) => ChildController.updateChild(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
    });
    this.childRoutes.delete('/:id', (c: AppContext) => ChildController.deleteChild(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
    });
    this.childRoutes.patch('/:id', (c: AppContext) => ChildController.registerChild(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
    });
  }
}

export default new ChildRoutes().childRoutes;
