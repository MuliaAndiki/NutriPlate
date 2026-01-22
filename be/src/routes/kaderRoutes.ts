import { AppContext } from '@/contex/appContex';
import KaderController from '@/controllers/KaderController';
import { verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class KaderRoutes {
  public kaderRoutes;

  constructor() {
    this.kaderRoutes = new Elysia({ prefix: '/kader' }).derive(() => ({
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
    // Kader registration routes
    this.kaderRoutes.post('/register', (c: AppContext) => KaderController.registerToposyandu(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });

    this.kaderRoutes.get(
      '/registrations',
      (c: AppContext) => KaderController.getMyRegistrations(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    // Posyandu routes for accepting/rejecting registrations
    this.kaderRoutes.get(
      '/pending-registrations',
      (c: AppContext) => KaderController.getPendingRegistrations(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    this.kaderRoutes.get(
      '/accepted-registrations',
      (c: AppContext) => KaderController.getAcceptedRegistrations(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    this.kaderRoutes.put(
      '/accept-registration',
      (c: AppContext) => KaderController.acceptRegistration(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    this.kaderRoutes.put(
      '/reject-registration',
      (c: AppContext) => KaderController.rejectRegistration(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
  }
}

export default new KaderRoutes().kaderRoutes;
