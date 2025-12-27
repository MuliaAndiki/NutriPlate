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
    this.progresRoutes.get('/', (c: AppContext) => ProgresController.getChildInProgram(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });

    this.progresRoutes.patch('/:id', (c: AppContext) => ProgresController.cancelChildProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'PARENT']).beforeHandle],
    });
    this.progresRoutes.get(
      '/history',
      (c: AppContext) => ProgresController.getHistoryChildProgram(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['POSYANDU', 'PARENT', 'KADER']).beforeHandle,
        ],
      },
    );
    this.progresRoutes.patch(
      '/accepted/:id',
      (c: AppContext) => ProgresController.accepProgram(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
      },
    );
    this.progresRoutes.get('/accepted', (c: AppContext) => ProgresController.getAccepProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT', 'POSYANDU']).beforeHandle],
    });
  }
}

export default new ProgresRoutes().progresRoutes;
