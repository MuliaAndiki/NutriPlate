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
    this.taskRoutes.get('/notBroadcast', (c: AppContext) => TaskController.getTaskNotBroadCast(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'KADER']).beforeHandle],
    });
    this.taskRoutes.post('/task/:id', (c: AppContext) => TaskController.doneTask(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['PARENT']).beforeHandle],
    });
    this.taskRoutes.post('/:id', (c: AppContext) => TaskController.createTask(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'KADER']).beforeHandle],
    });
    this.taskRoutes.get('/', (c: AppContext) => TaskController.getTaskForChild(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.taskRoutes.put('/:id', (c: AppContext) => TaskController.updateTask(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
    this.taskRoutes.delete('/:id', (c: AppContext) => TaskController.deleteTask(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
    this.taskRoutes.patch('/broadcast', (c: AppContext) => TaskController.broadcastTasks(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
    });
  }
}

export default new TaskRoutes().taskRoutes;
