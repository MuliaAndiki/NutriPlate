import { AppContext } from '@/contex/appContex';
import { JwtPayload, PickActiveAccount } from '@/types/auth.types';
import { PickCreatePosyandu, PickPosyanduID } from '@/types/posyandu.types';
import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { env } from '@/config/env.config';
import { sendActivationEmail } from '@/utils/sendActiveEmail';
import { generateOtp } from '@/utils/generate-otp';
import { sendOTPEmail } from '@/utils/mailer';
import { cacheKeys } from '@/cache/cacheKey';
import { error } from 'console';

class PosyanduController {
  private get redis() {
    return getRedis();
  }
  public async createPosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const posyanduBody = c.body as PickCreatePosyandu;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
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
            message: 'body is required',
          },
          400,
        );
      }

      const activateToken = crypto.randomUUID();
      const activateExp = new Date(Date.now() + 15 * 60 * 1000);
      const user = await prisma.user.create({
        data: {
          email: posyanduBody.email,
          phone: posyanduBody.phone,
          role: 'POSYANDU',
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
            message: 'server internal error',
          },
          400,
        );
      } else {
        return c.json?.(
          {
            status: 201,
            message: 'succesfully create posyandu',
            data: posyandu,
          },
          201,
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
  public async getPosyandu(c: AppContext) {
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
        return c.json?.({ status: 404, message: 'User not found' }, 404);
      }

      let whereConditional: any = {};
      let cacheKey = cacheKeys.posyandu.list();

      if (user.role === 'POSYANDU') {
        whereConditional.userID = user.id;
        cacheKey = cacheKeys.posyandu.byUser(user.id);
      }
      try {
        const cachePosyandu = await this.redis.get(cacheKey);
        if (cachePosyandu) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get posyandu (cache)',
              data: JSON.parse(cachePosyandu),
            },
            200,
          );
        }
      } catch (error) {
        console.warn('Redis error, fallback to DB');
      }

      const posyandu = await prisma.posyandu.findMany({
        where: whereConditional,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          avaUrl: true,
          name: true,
          village: true,
          subDistrict: true,
          district: true,
          _count: {
            select: {
              children: true,
            },
          },
        },
      });

      if (!posyandu || posyandu.length === 0) {
        return c.json?.({ status: 404, message: 'posyandu not found' }, 404);
      }

      await this.redis
        .set(cacheKey, JSON.stringify(posyandu), { EX: 60 })
        .catch((err) => console.warn('Redis set error', err));

      return c.json?.(
        {
          status: 200,
          message: 'successfully get posyandu',
          data: posyandu,
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

  public async getPosyanduByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: 'params is requiredmend',
          },
          400,
        );
      }

      const cacheKey = cacheKeys.posyandu.byID(params.id);
      try {
        const cachePosyandu = await this.redis.get(cacheKey);
        if (cachePosyandu) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get posyandu by id',
              data: JSON.parse(cachePosyandu),
            },
            200,
          );
        }
      } catch (error) {
        console.warn('Redis Error, fallback DB');
      }

      const posyandu = await prisma.posyandu.findUnique({
        where: {
          id: params.id,
        },
      });

      await this.redis.set(cacheKey, JSON.stringify(posyandu), { EX: 60 }).catch(error);
      if (!posyandu) {
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
            message: 'succesfully get posyandu byId',
            data: posyandu,
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

  public async activeAccount(c: AppContext) {
    try {
      const authBody = c.body as PickActiveAccount;
      if (!authBody.password || !authBody.activateToken) {
        return c.json?.(
          {
            status: 400,
            message: 'token & password required',
          },
          400,
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
            message: 'inavalid token',
          },
          400,
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
            message: 'server internal error',
          },
          400,
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: 'succesfully active account posyandu',
            data: active,
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
  public async updatePosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      const posyanduBody = c.body as Partial<PickCreatePosyandu>;
      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      const isUpdateEmail = typeof posyanduBody.email === 'string' && posyanduBody.email.length > 0;

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

      await this.redis.del(cacheKey).catch(error);

      if (!result) {
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
            message: 'succesfully update posyandu',
            data: result,
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
  public async deletePosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const admin = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });

      if (!admin || admin.role !== 'ADMIN') {
        return c.json?.(
          {
            status: 403,
            message: "can't acces role",
          },
          403,
        );
      }

      const cacheKey = cacheKeys.posyandu.byID(params.id);
      const result = await prisma.$transaction(async (tx) => {
        const posyandu = await tx.posyandu.delete({
          where: {
            id: admin.id,
          },
        });
        const user = await tx.user.delete({
          where: {
            id: posyandu.userID,
          },
        });
        return { posyandu, user };
      });

      await this.redis.del(cacheKey).catch(error);
      if (!result) {
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
            message: 'succesfully delete posyandu',
            data: result,
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
  public async getKaderListByPosyandu(c: AppContext) {
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

      if (jwtUser.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'Hanya posyandu yang dapat mengakses',
          },
          403,
        );
      }

      const posyandu = await prisma.posyandu.findFirst({
        where: {
          userID: jwtUser.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'Posyandu tidak ditemukan',
          },
          404,
        );
      }

      const cacheKey = cacheKeys.kaderregistration.byPosyandu(posyandu.id);
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return c.json?.(
          {
            status: 200,
            message: 'Berhasil mendapatkan daftar kader',
            data: JSON.parse(cached),
          },
          200,
        );
      }

      const kaderList = await prisma.kaderRegistration.findMany({
        where: {
          posyanduId: posyandu.id,
          status: 'accepted',
        },
        select: {
          id: true,
          kaderId: true,
          kader: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      const formattedData = {
        posyandu: {
          id: posyandu.id,
          name: posyandu.name,
        },
        totalKader: kaderList.length,
        kaders: kaderList.map((reg) => ({
          registrationId: reg.id,
          id: reg.kader.id,
          fullName: reg.kader.fullName,
          email: reg.kader.email,
          role: reg.kader.role,
          registeredAt: reg.createdAt,
          acceptedAt: reg.updatedAt,
        })),
      };

      await this.redis.set(cacheKey, JSON.stringify(formattedData), { EX: 300 });

      return c.json?.(
        {
          status: 200,
          message: 'Berhasil mendapatkan daftar kader',
          data: formattedData,
        },
        200,
      );
    } catch (error) {
      console.error('[getKaderListByPosyandu]', error);
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

  public async getChildListByPosyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!params?.id) {
        return c.json?.(
          {
            status: 400,
            message: 'Posyandu ID is required',
          },
          400,
        );
      }

      let isAuthorized = false;

      if (jwtUser.role === 'POSYANDU') {
        const posyanduOwner = await prisma.posyandu.findFirst({
          where: {
            id: params.id,
            userID: jwtUser.id,
          },
          select: { id: true },
        });
        isAuthorized = !!posyanduOwner;
      } else if (jwtUser.role === 'KADER') {
        const kaderRegistration = await prisma.kaderRegistration.findFirst({
          where: {
            posyanduId: params.id,
            kaderId: jwtUser.id,
            status: 'accepted',
          },
          select: { id: true },
        });
        isAuthorized = !!kaderRegistration;
      }

      if (!isAuthorized) {
        return c.json?.(
          {
            status: 403,
            message: 'Anda tidak memiliki akses ke posyandu ini',
          },
          403,
        );
      }

      const posyandu = await prisma.posyandu.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          name: true,
        },
      });

      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'Posyandu tidak ditemukan',
          },
          404,
        );
      }

      const cacheKey = cacheKeys.child.byPosyandu(params.id);
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return c.json?.(
          {
            status: 200,
            message: 'Berhasil mendapatkan daftar anak',
            data: JSON.parse(cached),
          },
          200,
        );
      }

      const children = await prisma.child.findMany({
        where: {
          posyanduId: params.id,
        },
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          gender: true,
          parentId: true,
          parent: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const formattedData = {
        posyandu: {
          id: posyandu.id,
          name: posyandu.name,
        },
        totalChildren: children.length,
        children: children.map((child) => ({
          id: child.id,
          fullName: child.fullName,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender,
          parent: {
            id: child.parent.id,
            fullName: child.parent.fullName,
            email: child.parent.email,
          },
          registeredAt: child.createdAt,
        })),
      };

      await this.redis.set(cacheKey, JSON.stringify(formattedData), { EX: 300 });

      return c.json?.(
        {
          status: 200,
          message: 'Berhasil mendapatkan daftar anak',
          data: formattedData,
        },
        200,
      );
    } catch (error) {
      console.error('[getChildListByPosyandu]', error);
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

export default new PosyanduController();
