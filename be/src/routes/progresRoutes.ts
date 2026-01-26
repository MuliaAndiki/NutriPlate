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
    this.progresRoutes.post(
      '/registrations',
      (c: AppContext) => ProgresController.registerChildToProgram(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(['PARENT', 'POSYANDU']).beforeHandle,
        ],
      },
    );
    this.progresRoutes.get(
      '/registrations',
      (c: AppContext) => ProgresController.getProgramRegistrations(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.progresRoutes.put(
      '/registrations/:id/accept',
      (c: AppContext) => ProgresController.acceptProgramRegistration(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
      },
    );
    this.progresRoutes.put(
      '/registrations/:id/reject',
      (c: AppContext) => ProgresController.rejectProgramRegistration(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
      },
    );

    this.progresRoutes.get(
      '/program/:childId',
      (c: AppContext) => ProgresController.getChildInProgram(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.progresRoutes.patch('/:id', (c: AppContext) => ProgresController.cancelChildProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'PARENT']).beforeHandle],
    });
    // not fix
    this.progresRoutes.get(
      '/:childId',
      (c: AppContext) => ProgresController.getChildInProgramByID(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
  }
}

export default new ProgresRoutes().progresRoutes;
