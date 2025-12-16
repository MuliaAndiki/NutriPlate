import { cacheKeys } from "@/cache/cacheKey";
import { AppContext } from "@/contex/appContex";
import { JwtPayload } from "@/types/auth.types";
import {
  PickCreateNotification,
  PickNotifID,
} from "@/types/notificatios.types";
import { getRedis } from "@/utils/redis";
import prisma from "prisma/client";
import app from "@/app";
import { error } from "console";

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
            message: "user not found",
          },
          400
        );
      }

      if (!notBody.message || !notBody.title || !notBody.type) {
        return c.json?.(
          {
            status: 400,
            message: "body is required",
          },
          400
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
          type: "notification:new",
          payload: notify,
        })
      );

      if (!notify) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: "succesfuly create notify",
            data: notify,
          },
          200
        );
      }
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async getNotificationsParent(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 400,
            message: "user not found",
          },
          400
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
        },
      });

      if (!user || user.role !== "PARENT") {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      const cacheKey = cacheKeys.notify.byRole(user.role);

      try {
        const cacheNotify = await this.redis.get(cacheKey);
        if (cacheNotify) {
          return c.json?.(
            {
              status: 200,
              message: "succesfully get notify by parent",
              data: JSON.parse(cacheNotify),
            },
            200
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }

      const notify = await prisma.notifications.findMany({
        where: {
          isBroadcast: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!notify || notify.length === 0) {
        await this.redis
          .set(cacheKey, JSON.stringify(notify), { EX: 60 })
          .catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: "succesfully get notify parent",
          data: notify,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async getNotificationKader(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
        },
      });

      if (!user || user.role !== "KADER") {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }

      const cacheKey = cacheKeys.notify.byRole(user.role);
      try {
        const cacheKader = await this.redis.get(cacheKey);
        if (cacheKader) {
          return c.json?.(
            {
              status: 200,
              message: "succesfully get cache kager",
              data: JSON.parse(cacheKader),
            },
            200
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }
      const notifications = await prisma.notifications.findMany({
        where: {
          isBroadcast: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!notifications || notifications.length === 0) {
        await this.redis
          .set(cacheKey, JSON.stringify(notifications), { EX: 60 })
          .catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: "succesfully get notifications",
          data: notifications,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async getNotificationPosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          400
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
        },
      });
      if (!user || user.role !== "POSYANDU") {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }

      const cacheKey = cacheKeys.notify.byRole(user.role);

      try {
        const cachePosyandu = await this.redis.get(cacheKey);
        if (cachePosyandu) {
          return c.json?.(
            {
              status: 200,
              message: "succesfully get notifications posyandu",
              data: JSON.parse(cachePosyandu),
            },
            200
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }

      const notification = await prisma.notifications.findMany({
        where: {
          isBroadcast: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!notification || notification.length === 0) {
        await this.redis
          .set(cacheKey, JSON.stringify(notification), { EX: 60 })
          .catch(error);
      }

      return c.json?.(
        {
          status: 200,
          message: "succesfully get notification posyandu",
          data: notification,
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
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
            message: "user not found",
          },
          400
        );
      }
      if (!notParams) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      const cacheKey = cacheKeys.notify.byID(notParams.id);
      try {
        const cacheNotify = await this.redis.get(cacheKey);
        if (cacheNotify) {
          return c.json?.(
            {
              status: 200,
              message: "succesfully get notification by id",
              data: JSON.parse(cacheNotify),
            },
            200
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db:${error}`);
      }
      const notification = await prisma.notifications.findUnique({
        where: {
          id: notParams.id,
          isBroadcast: true,
        },
      });
      await this.redis
        .set(cacheKey, JSON.stringify(notification), { EX: 60 })
        .catch(error);
      if (!notification) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get notifications by id",
            data: notification,
          },
          200
        );
      }
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
        },
        500
      );
    }
  }
  public async getAllNotification(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
        },
      });

      if (!user || user.role !== "ADMIN") {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      const cacheKey = cacheKeys.notify.list();
      try {
        const cacheNotifications = await this.redis.get(cacheKey);
        if (cacheNotifications) {
          return c.json?.(
            {
              status: 200,
              message: "succesfully get all notafication",
              data: JSON.parse(cacheNotifications),
            },
            200
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }
      const notification = await prisma.notifications.findMany({
        where: {
          isBroadcast: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!notification || notification.length === 0) {
        await this.redis
          .set(cacheKey, JSON.stringify(notification), { EX: 60 })
          .catch(error);
      }
      if (!notification) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      }
      return c.json?.(
        {
          status: 200,
          message: "succesfully get notification",
          data: notification,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
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
            message: "user not found",
          },
          404
        );
      }
      if (!notParams) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
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
          type: "notification:update",
          payload: notafication,
        })
      );

      await this.redis.del(cacheKey).catch(error);
      if (!notafication || notafication.isBroadcast === false) {
        return c.json?.({
          status: 400,
          message: "server internal error & notif is broadcast",
        });
      }

      return c.json?.(
        {
          status: 200,
          message: "succesfully update notification",
          data: notafication,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
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
            message: "user not found",
          },
          404
        );
      }
      if (!notParams) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
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
          message: "server internal error & notif is broadcast",
        });
      }
      await this.redis.del(cacheKey);
      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: "notification:delete",
          payload: notafication,
        })
      );
      return c.json?.(
        {
          status: 200,
          message: "succesfully delete notification",
          data: notafication,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
}

export default new NotificationController();
