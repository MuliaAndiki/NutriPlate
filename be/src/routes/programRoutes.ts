import { AppContext } from '@/contex/appContex';
import ProgramController from '@/controllers/ProgramController';
import { requireRole, verifyToken } from '@/middlewares/auth';

import Elysia from 'elysia';
class ProgramRouter {
  public programRoutes;
  constructor() {
    this.programRoutes = new Elysia({ prefix: '/programs' }).derive(() => ({
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
    this.programRoutes.post('/:id', (c: AppContext) => ProgramController.createProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
    this.programRoutes.put(`/:id`, (c: AppContext) => ProgramController.updateProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
    this.programRoutes.get('/', (c: AppContext) => ProgramController.getPrograms(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.programRoutes.get('/:id', (c: AppContext) => ProgramController.getProgrambyID(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT', 'KADER']).beforeHandle],
    });
    this.programRoutes.delete('/:id', (c: AppContext) => ProgramController.deleteProgram(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
  }
}

export default new ProgramRouter().programRoutes;
