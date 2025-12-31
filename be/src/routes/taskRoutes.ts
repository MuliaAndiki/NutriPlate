import { AppContext } from '@/contex/appContex';
import TaskController from '@/controllers/TaskController';
import { requireRole, verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class TaskRoutes {
  public taskRoutes;
  constructor() {
    this.taskRoutes = new Elysia({ prefix: '/task' }).derive(() => ({
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
    this.taskRoutes.post('/:id', (c: AppContext) => TaskController.createTask(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
    this.taskRoutes.get('/', (c: AppContext) => TaskController.getTaskForChild(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
  }
}

export default new TaskRoutes().taskRoutes;
