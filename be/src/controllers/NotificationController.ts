import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateNotification, PickNotifID } from '@/types/notificatios.types';
import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import app from '@/app';
import { error } from 'console';
import { Tuple_Roles } from '@/utils/roleTuple';

class NotificationController {
  private get redis() {
    return getRedis();
  }
  public async createNotification(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const notBody = c.body as PickCreateNotification;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 400,
            message: 'user not found',
          },
          400,
        );
      }

      if (!notBody.message || !notBody.title || !notBody.type) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }
      const notify = await prisma.notifications.create({
        data: {
          title: notBody.title,
          message: notBody.message,
          type: notBody.type,
          userId: jwtUser.id,
        },
      });

      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'notification:new',
          payload: notify,
        }),
      );

      if (!notify) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: 'succesfuly create notify',
            data: notify,
          },
          200,
        );
      }
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
            status: 400,
            message: 'user not found',
          },
          400,
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
        const posyandu = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
          select: {
            id: true,
            role: true,
          },
        });

        if (!posyandu || posyandu.role !== 'POSYANDU') {
          return c.json?.(
            {
              status: 404,
              message: 'posyandu not found & cannot acces',
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

      const cacheKey = cacheKeys.notify.byRole(user.role);
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

      if (!notafication) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

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
            status: 404,
            message: 'user not found',
          },
          400,
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
      const cacheKey = cacheKeys.notify.byID(notParams.id);
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
      const notification = await prisma.notifications.findUnique({
        where: {
          id: notParams.id,
        },
        select: {
          isBroadcast: true,
        },
      });

      if (!notification || notification.isBroadcast === true) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }
      await prisma.notifications.update({
        where: {
          id: notParams.id,
          userId: jwtUser.id,
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
            status: 404,
            message: 'user not found',
          },
          404,
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
      const cacheKey = cacheKeys.notify.byID(notParams.id);

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
            status: 404,
            message: 'user not found',
          },
          404,
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
      const cacheKey = cacheKeys.notify.byID(notParams.id);
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
      const jwtPayload = c.user as JwtPayload;
      const notParams = c.params as PickNotifID;
      if (!jwtPayload) {
        return c.json?.(
          {
            status: 404,
            message: ' user not found',
          },
          404,
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

      const user = await prisma.user.findFirst({
        where: {
          id: jwtPayload.id,
        },
        select: {
          role: true,
          id: true,
        },
      });

      if (!user || (user.role !== 'ADMIN' && user.role !== 'POSYANDU')) {
        return c.json?.(
          {
            status: 403,
            message: 'acces forenbaden',
          },
          403,
        );
      }
      const cacheKey = Tuple_Roles.map((role) => cacheKeys.notify.byRole(role));
      const notif = await prisma.notifications.findFirst({
        where: {
          id: notParams.id,
          userId: user.id,
        },
      });

      if (!notif) {
        return c.json?.(
          {
            status: 404,
            message: 'notafication not found',
          },
          404,
        );
      }

      const notification = await prisma.notifications.update({
        where: {
          id: notif.id,
        },
        data: {
          isBroadcast: true,
        },
      });
      await this.redis.del(cacheKey).catch(error);

      app.server?.publish(
        `user:${jwtPayload.id}`,
        JSON.stringify({
          type: 'notification:broadcast',
          payload: notification,
        }),
      );
      if (!notification) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully update notafication',
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
}

export default new NotificationController();
