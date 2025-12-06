import { AppContext } from "@/contex/appContex";
import { JwtPayload, PickActiveAccount } from "@/types/auth.types";
import { PickCreatePosyandu, PickPosyanduID } from "@/types/posyandu.types";
import { redis } from "@/utils/redis";
import prisma from "prisma/client";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { env } from "@/config/env.config";
import { sendActivationEmail } from "@/utils/sendActiveEmail";

class PosyanduController {
  public async createPosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const posyanduBody = c.body as PickCreatePosyandu;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "account not found",
          },
          404
        );
      }
      if (
        !posyanduBody.district ||
        !posyanduBody.name ||
        !posyanduBody.avaUrl ||
        !posyanduBody.phone ||
        !posyanduBody.subDistrict ||
        !posyanduBody.village ||
        !posyanduBody.email
      ) {
        return c.json?.(
          {
            status: 400,
            message: "body is required",
          },
          400
        );
      }

      const activateToken = crypto.randomUUID();
      const activateExp = new Date(Date.now() + 15 * 60 * 1000);
      const user = await prisma.user.create({
        data: {
          email: posyanduBody.email,
          phone: posyanduBody.phone,
          role: "POSYANDU",
          isVerify: false,
          fullName: posyanduBody.name,
          activateToken: activateToken,
          activateExp: activateExp,
        },
      });

      const posyandu = await prisma.posyandu.create({
        data: {
          name: posyanduBody.name,
          district: posyanduBody.district,
          avaUrl: posyanduBody.avaUrl,
          phone: posyanduBody.phone,
          scheduleDay: posyanduBody.scheduleDay,
          subDistrict: posyanduBody.subDistrict,
          village: posyanduBody.village,
          email: posyanduBody.email,
          userID: user.id,
        },
      });

      const activateLink = `${env.FRONTEND_URL}/activate?token=${activateToken}`;
      await sendActivationEmail(posyanduBody.email, activateLink);

      if (!posyandu) {
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
            status: 201,
            message: "succesfully create posyandu",
            data: posyandu,
          },
          201
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
  public async getPosyandu(c: AppContext) {
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
      const cacheKey = `posyandu:${jwtUser.id}`;
      const cachePosyandu = await redis.get(cacheKey);
      if (cachePosyandu) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get cache posyandu",
            data: cachePosyandu,
          },
          200
        );
      }
      const posyandu = await prisma.posyandu.findMany({
        where: {
          userID: jwtUser.id,
        },
      });
      await redis.set(cacheKey, JSON.stringify(posyandu), { EX: 60 });
      if (!posyandu) {
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
            message: "succesfully get posyandu",
            data: posyandu,
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
  public async getPosyanduByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: "params is requiredmend",
          },
          400
        );
      }

      const cacheKey = `posyanduByID:${params}`;
      const cachePosyandu = await redis.get(cacheKey);
      if (cachePosyandu) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get posyandu by id",
          },
          200
        );
      }

      const posyandu = await prisma.posyandu.findUnique({
        where: {
          id: params.id,
        },
      });
      await redis.set(cacheKey, JSON.stringify(posyandu), { EX: 60 });
      if (!posyandu) {
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
            message: "succesfully get posyandu byId",
            data: 200,
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

  public async getKader(c: AppContext) {
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
      const cacheKey = `kader:${jwtUser.id}`;
      const cacheKader = await redis.get(cacheKey);
      if (cacheKader) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get kader by cache",
            data: cacheKader,
          },
          200
        );
      }
      const user = await prisma.user.findMany({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: jwtUser.role === "KADER",
        },
      });
      await redis.set(cacheKey, JSON.stringify(user), { EX: 60 });
      if (!user) {
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
            message: "succesfully get kader",
            data: user,
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
  public async activeAccount(c: AppContext) {
    try {
      const authBody = c.body as PickActiveAccount;
      if (!authBody.password || !authBody.activateToken) {
        return c.json?.(
          {
            status: 400,
            message: "token & password required",
          },
          400
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          activateToken: authBody.activateToken,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 400,
            message: "inavalid token or expired token",
          },
          400
        );
      }
      const hash = await bcryptjs.hash(authBody.password, 10);
      const active = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
          isVerify: true,
          activateToken: null,
          activateExp: null,
        },
      });

      if (!active) {
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
            message: "succesfully active account posyandu",
            data: active,
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
}

export default new PosyanduController();
