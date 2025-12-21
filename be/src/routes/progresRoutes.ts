import { AppContext } from '@/contex/appContex';
import ProgresController from '@/controllers/ProgresController';
import { requireRole, verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class ProgresRoutes {
  public progresRoutes;
  constructor() {
    this.progresRoutes = new Elysia({ prefix: '/progres' }).derive(() => ({
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
    this.progresRoutes.post(`/`, (c: AppContext) => ProgresController.assingProgramChild(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
    this.progresRoutes.get('/', (c: AppContext) => ProgresController.getChildInProgramByParent(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.progresRoutes.delete('/:id', (c: AppContext) => ProgresController.cancelChildProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'PARENT']).beforeHandle],
    });
  }
}

export default new ProgresRoutes().progresRoutes;
