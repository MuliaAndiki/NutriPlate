import { AppContext } from "@/contex/appContex";
import { JwtPayload, PickActiveAccount } from "@/types/auth.types";
import { PickCreatePosyandu, PickPosyanduID } from "@/types/posyandu.types";
import { redis } from "@/utils/redis";
import prisma from "prisma/client";
import bcryptjs from "bcryptjs";
import crypto, { publicDecrypt } from "crypto";
import { env } from "@/config/env.config";
import { sendActivationEmail } from "@/utils/sendActiveEmail";
import { generateOtp } from "@/utils/generate-otp";
import { sendOTPEmail } from "@/utils/mailer";
import { cacheKeys } from "@/cache/cacheKey";

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
      const cacheKey = cacheKeys.posyandu.list();
      const cachePosyandu = await redis.get(cacheKey);
      if (cachePosyandu) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get cache posyandu",
            data: JSON.parse(cachePosyandu),
          },
          200
        );
      }
      const posyandu = await prisma.posyandu.findMany({
        where: {
          userID: jwtUser.id,
        },
        select: {
          id: true,
          avaUrl: true,
          name: true,
          village: true,
          _count: true,
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

      const cacheKey = cacheKeys.posyandu.byID(params.id);
      const cachePosyandu = await redis.get(cacheKey);
      if (cachePosyandu) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get posyandu by id",
            data: JSON.parse(cachePosyandu),
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
            message: "inavalid token",
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
  public async updatePosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      const posyanduBody = c.body as Partial<PickCreatePosyandu>;
      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      const isUpdateEmail =
        typeof posyanduBody.email === "string" && posyanduBody.email.length > 0;

      const cacheKey = cacheKeys.posyandu.byID(params.id);

      const result = await prisma.$transaction(async (tx) => {
        const posyandu = await tx.posyandu.update({
          where: {
            id: params.id,
          },
          data: {
            ...(posyanduBody.name && { name: posyanduBody.name }),
            ...(posyanduBody.avaUrl && { avaUrl: posyanduBody.avaUrl }),

            ...(posyanduBody.subDistrict && {
              subDistrict: posyanduBody.subDistrict,
            }),
            ...(posyanduBody.district && { district: posyanduBody.district }),
            ...(posyanduBody.avaUrl && { avaUrl: posyanduBody.avaUrl }),
            ...(posyanduBody.phone && { phone: posyanduBody.phone }),
            ...(posyanduBody.scheduleDay && {
              scheduleDay: posyanduBody.scheduleDay,
            }),
          },
        });

        const user = await tx.user.update({
          where: {
            id: posyandu.userID,
          },
          data: {
            ...(posyanduBody.phone && { phone: posyanduBody.phone }),
            ...(posyanduBody.name && { fullName: posyanduBody.name }),
          },
        });
        if (isUpdateEmail) {
          const otp = generateOtp(6);
          const expOtp = new Date(Date.now() + 5 * 60 * 1000);
          await tx.user.update({
            where: {
              id: posyandu.userID,
            },
            data: {
              email: posyanduBody.email,
              isVerify: false,
              otp: otp,
              expOtp: expOtp,
            },
          });
          await sendOTPEmail(posyanduBody.email!, otp);
        }
        return { posyandu, user };
      });

      await redis.del(cacheKey);

      if (!result) {
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
            message: "succesfully update posyandu",
            data: result,
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
  public async deletePosyandu(c: AppContext) {
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
            message: "params is required",
          },
          400
        );
      }
      const cacheKey = cacheKeys.posyandu.byID(params.id);
      const result = await prisma.$transaction(async (tx) => {
        const posyandu = await tx.posyandu.delete({
          where: {
            id: params.id,
          },
        });
        const user = await tx.user.delete({
          where: {
            id: posyandu.userID,
          },
        });
        return { posyandu, user };
      });

      await redis.del(cacheKey);
      if (!result) {
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
            message: "succesfully delete posyandu",
            data: result,
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
  public async getChildPosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          400
        );
      }
      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      const child = await prisma.child.findMany({
        where: {
          posyanduId: params.id,
        },
      });

      const cacheKey = cacheKeys.child.byPosyanduList(params.id);
      const cachePosyandu = await redis.get(cacheKey);

      if (cachePosyandu) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get cache child",
            data: JSON.parse(cachePosyandu),
          },
          200
        );
      }

      await redis.set(cacheKey, JSON.stringify(child), { EX: 60 });
      if (!child) {
        c.json?.(
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
            message: "succesfully get child",
            data: child,
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
