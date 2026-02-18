import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateNotification, PickNotifID } from '@/types/notificatios.types';
import prisma from 'prisma/client';
import app from '@/app';
import { NotificationService } from '@/service/notifikasi.service';

class NotificationController {
  public async createNotification(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as PickCreateNotification;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      const notification = await prisma.notifications.create({
        data: {
          userId: jwtUser.id,
          title: body.title,
          message: body.message,
          type: body.type,
          isBroadcast: false,
        },
      });

      return c.json?.(
        {
          status: 200,
          message: 'succesfully create notification',
          data: notification,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async getNotifications(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const user = await prisma.user.findFirst({
        where: { id: jwtUser.id },
        select: { id: true, role: true },
      });

      if (!user) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      let whereCondition: any = {};

      if (user.role === 'PARENT' || user.role === 'KADER') {
        whereCondition = {
          isBroadcast: true,
        };
      } else if (user.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: { userID: user.id },
          select: { id: true },
        });

        if (!posyandu) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }

        whereCondition = {
          OR: [{ isBroadcast: true }, { isBroadcast: false, userId: user.id }],
        };
      } else if (user.role === 'ADMIN') {
        whereCondition = {
          OR: [{ isBroadcast: true }, { isBroadcast: false }],
        };
      } else {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      const notifications = await prisma.notifications.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
      });

      app.server?.publish(
        `user:${user.id}`,
        JSON.stringify({
          type: 'notification:get',
          payload: notifications,
        }),
      );

      return c.json?.(
        {
          status: 200,
          message: 'successfully get notifications',
          data: notifications,
        },
        200,
      );
    } catch (error) {
      console.error('getNotifications error:', error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async getNotificationByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!notParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const notification = await prisma.notifications.findFirst({
        where: {
          id: notParams.id,
        },
      });

      if (!notification) {
        return c.json?.(
          {
            status: 404,
            message: 'notification not found',
          },
          404,
        );
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get notifications by id',
          data: notification,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async updateNotification(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;
      const notBody = c.body as PickCreateNotification;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!notParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const notafication = await prisma.notifications.update({
        where: {
          id: notParams.id,
          userId: jwtUser.id,
        },
        data: {
          ...notBody,
        },
        select: {
          isBroadcast: true,
        },
      });

      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'notification:update',
          payload: notafication,
        }),
      );
      if (!notafication || notafication.isBroadcast !== false) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error & notif is broadcast',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfully update notification',
          data: notafication,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async deleteNotification(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!notParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const notification = await prisma.notifications.delete({
        where: {
          id: notParams.id,
          userId: jwtUser.id,
        },
        select: {
          isBroadcast: true,
        },
      });
      if (!notification || notification.isBroadcast === false) {
        return c.json?.({
          status: 400,
          message: 'server internal error & notif is broadcast',
        });
      }

      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'notification:delete',
          payload: notification,
        }),
      );
      return c.json?.(
        {
          status: 200,
          message: 'succesfully delete notification',
          data: notification,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async broadcastNotifications(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: ' Unauthorized',
          },
          401,
        );
      }
      const notification = await NotificationService.broadcastFromDraft(jwtUser.id, notParams.id);

      return c.json?.({
        status: 200,
        message: 'notification broadcasted',
        data: notification,
      });
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async markNotificationAsRead(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!notParams?.id) {
        return c.json?.(
          {
            status: 400,
            message: 'Notification ID is required',
          },
          400,
        );
      }

      const updatedNotification = await prisma.notifications.update({
        where: { id: notParams.id },
        data: {
          isRead: true,
        },
      });

      if (!updatedNotification) {
        return c.json?.(
          {
            status: 404,
            message: 'Notification not found',
          },
          404,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'Notification marked as read',
          data: updatedNotification,
        },
        200,
      );
    } catch (error) {
      console.error('[markNotificationAsRead]', error);
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async isNotificationRead(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!notParams?.id) {
        return c.json?.(
          {
            status: 400,
            message: 'Notification ID is required',
          },
          400,
        );
      }

      const notifikasi = await prisma.notifications.findUnique({
        where: {
          id: notParams.id,
        },
        select: {
          isRead: true,
        },
      });

      return c.json?.(
        {
          status: 200,
          message: 'Successfully get notification read status',
          data: {
            notifikasiId: notParams.id,
            isRead: notifikasi?.isRead ?? false,
          },
        },
        200,
      );
    } catch (error) {
      console.error('[isNotificationRead]', error);
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
}

export default new NotificationController();
