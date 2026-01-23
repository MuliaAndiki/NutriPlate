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
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      let notafications: any = [];
      if (user.role === 'PARENT') {
        const parent = user.id;
        if (!parent) {
          return c.json?.(
            {
              status: 404,
              message: 'parent not found',
            },
            404,
          );
        }
        const notif = await prisma.notifications.findMany({
          where: {
            isBroadcast: true,
          },
        });
        notafications = notif.map((c) => c.id);
      } else if (user.role === 'KADER') {
        const kader = user.id;
        if (!kader) {
          return c.json?.(
            {
              status: 404,
              message: 'kader not found',
            },
            404,
          );
        }
        const notif = await prisma.notifications.findMany({
          where: {
            isBroadcast: true,
          },
          select: {
            id: true,
          },
        });

        notafications = notif.map((c) => c.id);
      } else if (user.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: {
            userID: user.id,
          },
          select: {
            id: true,
          },
        });

        if (!posyandu) {
          return c.json?.(
            {
              status: 404,
              message: 'posyandu not found ',
            },
            404,
          );
        }

        const notif = await prisma.notifications.findMany({
          where: {
            userId: posyandu.id,
            OR: [{ isBroadcast: false }, { isBroadcast: true }],
          },
          select: {
            id: true,
          },
        });
        notafications = notif.map((c) => c.id);
      } else if (user.role === 'ADMIN') {
        const admin = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
          select: {
            role: true,
            id: true,
          },
        });
        if (!admin || admin.role !== 'ADMIN') {
          return c.json?.(
            {
              status: 404,
              message: 'admin not found',
            },
            404,
          );
        }
        const notif = await prisma.notifications.findMany({
          where: {
            userId: admin.id,
            OR: [{ isBroadcast: false }, { isBroadcast: true }],
          },
          select: {
            id: true,
          },
        });
        notafications = notif.map((c) => c.id);
      }

      if (notafications.length === 0) {
        return c.json?.(
          {
            status: 404,
            message: 'notafication not found',
          },
          404,
        );
      }

      const cacheKey = cacheKeys.notification.byUser(jwtUser.id);
      try {
        const cacheNotif = await this.redis.get(cacheKey);
        if (cacheNotif) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get notifocation by cache',
              data: JSON.parse(cacheNotif),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db`);
      }

      const notafication = await prisma.notifications.findMany({
        where: {
          id: {
            in: notafications,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (notafication && notafication.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(notafication), { EX: 60 });
      }
      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'notification:get',
          payload: notafication,
        }),
      );

      return c.json?.(
        {
          status: 200,
          message: 'succesfully get notafications',
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

      await prisma.notifications.update({
        where: {
          id: notification.id,
        },
        data: {
          isRead: true,
        },
      });
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

      await this.redis.del(cacheKey).catch(error);
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
      const notafication = await prisma.notifications.delete({
        where: {
          id: notParams.id,
          userId: jwtUser.id,
        },
        select: {
          isBroadcast: true,
        },
      });
      if (!notafication || notafication.isBroadcast === false) {
        return c.json?.({
          status: 400,
          message: 'server internal error & notif is broadcast',
        });
      }
      await this.redis.del(cacheKey);
      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'notification:delete',
          payload: notafication,
        }),
      );
      return c.json?.(
        {
          status: 200,
          message: 'succesfully delete notification',
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
}

export default new NotificationController();
