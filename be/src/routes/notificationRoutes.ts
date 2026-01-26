import { AppContext } from '@/contex/appContex';
import NotificationController from '@/controllers/NotificationController';
import { requireRole, verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class NotificationRouter {
  public notificationRoutes;
  constructor() {
    this.notificationRoutes = new Elysia({ prefix: '/notifications' }).derive(() => ({
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
    this.notificationRoutes.post(
      `/`,
      (c: AppContext) => NotificationController.createNotification(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['ADMIN', 'POSYANDU']).beforeHandle],
      },
    );

    this.notificationRoutes.get(
      '/:id',
      (c: AppContext) => NotificationController.getNotificationByID(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.notificationRoutes.get(
      '/',
      (c: AppContext) => NotificationController.getNotifications(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.notificationRoutes.put(
      `/:id`,
      (c: AppContext) => NotificationController.updateNotification(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
      },
    );
    this.notificationRoutes.delete(
      '/:id',
      (c: AppContext) => NotificationController.deleteNotification(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.notificationRoutes.patch(
      '/broadcast/:id',
      (c: AppContext) => NotificationController.broadcastNotifications(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['ADMIN', 'POSYANDU']).beforeHandle],
      },
    );

    this.notificationRoutes.patch(
      '/:id/read',
      (c: AppContext) => NotificationController.markNotificationAsRead(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );

    this.notificationRoutes.get(
      '/:id/read-status',
      (c: AppContext) => NotificationController.isNotificationRead(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
  }
}

export default new NotificationRouter().notificationRoutes;
