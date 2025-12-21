import { AppContext } from '@/contex/appContex';
import UserController from '@/controllers/UserController';
import { verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class UserRoutes {
  public userRoutes;

  constructor() {
    this.userRoutes = new Elysia({ prefix: '/users' }).derive(() => ({
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
    this.userRoutes.put('/profile', (c: AppContext) => UserController.editProfile(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });

    this.userRoutes.delete('/account', (c: AppContext) => UserController.deleteAccount(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/profile', (c: AppContext) => UserController.getProfile(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.put('/password', (c: AppContext) => UserController.updatePassword(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/parent', (c: AppContext) => UserController.getParent(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/profile/:id', (c: AppContext) => UserController.getUserByID(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.post('/allReadyLogin', (c: AppContext) => UserController.AllReadyLogin(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/kader', (c: AppContext) => UserController.getKader(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/child', (c: AppContext) => UserController.getChild(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/child/:id', (c: AppContext) => UserController.getChildByID(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/kader/:id', (c: AppContext) => UserController.getKaderByID(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.userRoutes.get('/parent/:id', (c: AppContext) => UserController.getParentByID(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
  }
}

export default new UserRoutes().userRoutes;
