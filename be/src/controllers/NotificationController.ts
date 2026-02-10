import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateNotification, PickNotifID } from '@/types/notificatios.types';
import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import app from '@/app';
import { error } from 'console';
import { NotificationService } from '@/service/notifikasi.service';

class NotificationController {
  private get redis() {
    return getRedis();
  }
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

      // Invalidate notification caches after creation
      await Promise.all([
        this.redis.del(cacheKeys.notification.list()),
        this.redis.del(cacheKeys.notification.byUser(jwtUser.id)),
      ]).catch(() => {});

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

      const cacheKey = cacheKeys.notification.byUser(user.id);
      try {
        const cacheNotif = await this.redis.get(cacheKey);
        if (cacheNotif) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get notifications (cache)',
              data: JSON.parse(cacheNotif),
            },
            200,
          );
        }
      } catch {
        console.warn('redis error, fallback db');
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
          OR: [{ isBroadcast: true }, { isBroadcast: false, userId: posyandu.id }],
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

      if (notifications.length === 0) {
        return c.json?.({ status: 404, message: 'notification not found' }, 404);
      }

      await this.redis.set(cacheKey, JSON.stringify(notifications), { EX: 60 }).catch(() => {});

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
      const cacheKey = cacheKeys.notification.byID(notParams.id);
      try {
        const cacheNotify = await this.redis.get(cacheKey);
        if (cacheNotify) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get notification by id',
              data: JSON.parse(cacheNotify),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db:${error}`);
      }
      const notification = await prisma.notifications.findFirst({
        where: {
          id: notParams.id,
          isBroadcast: true,
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

      await this.redis.set(cacheKey, JSON.stringify(notification), { EX: 60 }).catch(error);
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
      const cacheKey = cacheKeys.notification.byID(notParams.id);

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

      // Invalidate both ID and user-scoped caches
      await Promise.all([
        this.redis.del(cacheKey),
        this.redis.del(cacheKeys.notification.byUser(jwtUser.id)),
      ]).catch(error);
      if (!notafication || notafication.isBroadcast === false) {
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
      const cacheKey = cacheKeys.notification.byID(notParams.id);
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

      // Invalidate both ID and user-scoped caches
      await Promise.all([
        this.redis.del(cacheKey),
        this.redis.del(cacheKeys.notification.byUser(jwtUser.id)),
      ]).catch(error);
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

      // Invalidate notification caches after broadcast
      await Promise.all([
        this.redis.del(cacheKeys.notification.byID(notParams.id)),
        this.redis.del(cacheKeys.notification.list()),
        this.redis.del(cacheKeys.notification.byUser(jwtUser.id)),
      ]).catch(() => {});

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

  // ✅ Mark notification as read per user (separate from global isRead)
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

      const notification = await prisma.notifications.findUnique({
        where: { id: notParams.id },
        select: { id: true },
      });

      if (!notification) {
        return c.json?.(
          {
            status: 404,
            message: 'Notification not found',
          },
          404,
        );
      }

      // ✅ Simpan per-user read status di Redis dengan key: notification:user:{userId}:{notifId}
      const readKey = `notification:read:${jwtUser.id}:${notParams.id}`;
      await this.redis.set(readKey, 'true', { EX: 86400 * 30 }); // 30 hari

      // Invalidate user's notification list cache
      await this.redis.del(cacheKeys.notification.byUser(jwtUser.id)).catch(() => {});

      return c.json?.(
        {
          status: 200,
          message: 'Notification marked as read',
          data: {
            notificationId: notParams.id,
            userId: jwtUser.id,
            readAt: new Date(),
          },
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

  // ✅ Check if notification is read by current user
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

      const readKey = `notification:read:${jwtUser.id}:${notParams.id}`;
      const isRead = await this.redis.get(readKey);

      return c.json?.(
        {
          status: 200,
          message: 'Successfully get notification read status',
          data: {
            notificationId: notParams.id,
            userId: jwtUser.id,
            isRead: isRead === 'true',
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
