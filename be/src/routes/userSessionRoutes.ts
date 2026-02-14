import { AppContext } from '@/contex/appContex';
import UsersessionController from '@/controllers/UsersessionController';
import { verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class UserSessionRoutes {
  public userSessionRoutes;

  constructor() {
    this.userSessionRoutes = new Elysia({ prefix: '/session' }).derive(() => ({
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
    this.userSessionRoutes.get('/', (c: AppContext) => UsersessionController.getUserSession(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userSessionRoutes.get(
      '/current',
      (c: AppContext) => UsersessionController.getCurrentSession(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
  }
}

export default new UserSessionRoutes().userSessionRoutes;
