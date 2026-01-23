import { AppContext } from '@/contex/appContex';
import PosyanduController from '@/controllers/PosyanduController';
import { requireRole, verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class PosyanduRoutes {
  public posyanduRoutes;
  constructor() {
    this.posyanduRoutes = new Elysia({ prefix: '/posyandu' }).derive(() => ({
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
    this.posyanduRoutes.post('/', (c: AppContext) => PosyanduController.createPosyandu(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['ADMIN']).beforeHandle],
    });
    this.posyanduRoutes.get('/', (c: AppContext) => PosyanduController.getPosyandu(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    // Static routes before dynamic routes
    this.posyanduRoutes.post('/active', (c) => PosyanduController.activeAccount(c));
    // Dynamic routes
    this.posyanduRoutes.get('/:id', (c: AppContext) => PosyanduController.getPosyanduByID(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.posyanduRoutes.put('/:id', (c: AppContext) => PosyanduController.updatePosyandu(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'ADMIN']).beforeHandle],
    });
    this.posyanduRoutes.delete('/:id', (c: AppContext) => PosyanduController.deletePosyandu(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['ADMIN', 'POSYANDU']).beforeHandle],
    });
  }
}

export default new PosyanduRoutes().posyanduRoutes;
