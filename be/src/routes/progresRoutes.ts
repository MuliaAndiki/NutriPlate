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
    this.progresRoutes.get(
      '/:childId',
      (c: AppContext) => ProgresController.getChildInProgramByID(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    this.progresRoutes.post(
      '/registration/register',
      (c: AppContext) => ProgresController.registerChildToProgram(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
      },
    );

    this.progresRoutes.get(
      '/registration',
      (c: AppContext) => ProgresController.getProgramRegistrations(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    this.progresRoutes.put(
      '/registration/accept',
      (c: AppContext) => ProgresController.acceptProgramRegistration(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
      },
    );

    this.progresRoutes.put(
      '/registration/reject',
      (c: AppContext) => ProgresController.rejectProgramRegistration(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
      },
    );
  }
}

export default new ProgresRoutes().progresRoutes;
