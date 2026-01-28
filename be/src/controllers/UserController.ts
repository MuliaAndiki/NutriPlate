import prisma from 'prisma/client';
import { JwtPayload, PickID, PickUpdatePassword, PickUpdateProfile } from '@/types/auth.types';
import { AppContext } from '@/contex/appContex';
import { uploadCloudinary } from '@/utils/clodinary';
import bcrypt from 'bcryptjs';
import { getRedis } from '@/utils/redis';
import { PickChilID } from '@/types/child.types';
import { cacheKeys } from '@/cache/cacheKey';
import { error } from 'console';
import { generateOtp } from '@/utils/generate-otp';
import { sendOTPEmail } from '@/utils/mailer';

class UserController {
  private get redis() {
    return getRedis();
  }
  public async getProfile(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const cacheKey = cacheKeys.user.byID(jwtUser.id);

      try {
        const cacheProfile = await this.redis.get(cacheKey);
        if (cacheProfile) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get cache profile',
              data: JSON.parse(cacheProfile),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const user = await prisma.user.findUnique({
        where: { id: jwtUser.id },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          role: true,
          avaUrl: true,
          isVerify: true,
          createdAt: true,
        },
      });

      if (!user) {
        return c.json?.({ status: 404, message: 'user not found' }, 404);
      }

      let profileData: any = { ...user };

      if (user.role === 'KADER') {
        const kaderRegistration = await prisma.kaderRegistration.findFirst({
          where: {
            kaderId: user.id,
            status: 'accepted',
          },
          select: {
            posyanduId: true,
            posyandu: {
              select: {
                name: true,
              },
            },
          },
        });

        profileData.posyanduId = kaderRegistration?.posyanduId || null;
        profileData.posyanduName = kaderRegistration?.posyandu?.name || null;
      }

      await this.redis.set(cacheKey, JSON.stringify(profileData), { EX: 60 }).catch(console.error);

      return c.json?.(
        {
          status: 200,
          message: 'successfully get user profile',
          data: profileData,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Internal Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async editProfile(c: AppContext) {
    try {
      const user = c.body as PickUpdateProfile;
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
      const cacheKey = [cacheKeys.user.byID(jwtUser.id)];

      const isUpdateEmail = typeof user.email === 'string' && user.email.length > 0;
      const isUpdatePhone = typeof user.email === 'string' && user.email.length > 0;
      let documentUrl: { avaUrl: string } = { avaUrl: '' };
      if (c.files?.avaUrl?.[0]) {
        const file = c.files.avaUrl[0];
        const buffer = file.buffer;

        const result = await uploadCloudinary(buffer, 'avaUrl', file.originalname);
        documentUrl.avaUrl = result.secure_url;
      } else if (
        user.avaUrl &&
        typeof user.avaUrl === 'string' &&
        user.avaUrl.startsWith('data:image')
      ) {
        const base64 = user.avaUrl;
        const buffer = Buffer.from(base64.split(',')[1], 'base64');
        const result = await uploadCloudinary(buffer, 'avaUrl', 'image.png');
        documentUrl.avaUrl = result.secure_url;
      }
      const updateUser = await prisma.$transaction(async (tx) => {
        const data: any = {};

        if (user.fullName) data.fullName = user.fullName;
        if (documentUrl.avaUrl) {
          data.avaUrl = documentUrl.avaUrl;
        }

        if (isUpdateEmail) {
          const otp = generateOtp(6);
          const expOtp = new Date(Date.now() + 5 * 60 * 1000);

          data.email = user.email;
          data.phone = null;
          data.isVerify = false;
          data.otp = otp;
          data.expOtp = expOtp;

          await sendOTPEmail(user.email!, otp);
        }

        if (isUpdatePhone) {
          data.phone = user.phone;
          data.email = null;
          data.isVerify = true;
          data.otp = null;
          data.expOtp = null;
        }

        return tx.user.update({
          where: { id: jwtUser.id },
          data,
        });
      });

      await this.redis.del(cacheKey).catch(error);
      return c.json?.(
        {
          status: 201,
          message: 'succes update profile',
          data: {
            updateUser,
            isUpdateEmail,
          },
        },
        201,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Internal Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async deleteAccount(c: AppContext) {
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
      const cacheKey = cacheKeys.user.byID(jwtUser.id);
      const auth = await prisma.user.delete({
        where: {
          id: jwtUser.id,
        },
      });

      if (!auth) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        await this.redis.del(cacheKey).catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: 'successfully delete acound',
          data: auth,
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
  public async updatePassword(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const usr = c.body as PickUpdatePassword;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!usr) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }

      const hashPassword = await bcrypt.hash(usr.password, 10);

      const user = await prisma.user.update({
        where: {
          id: jwtUser.id,
        },
        data: {
          password: hashPassword,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        // Invalidate user cache after password update
        await this.redis.del(cacheKeys.user.byID(jwtUser.id)).catch(error);

        return c.json?.(
          {
            status: 200,
            message: 'successfully update password',
            data: user,
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
  public async getParent(c: AppContext) {
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

      const cacheKey = cacheKeys.parent.list();
      try {
        const cacheUser = await this.redis.get(cacheKey);

        if (cacheUser) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully data from cache',
              data: JSON.parse(cacheUser),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const user = await prisma.user.findMany({
        where: { role: 'PARENT' },
      });

      if (!user) {
        return c.json?.({ status: 400, message: 'server internal error' }, 400);
      } else if (user && user.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(user), { EX: 60 }).catch(error);
      }

      return c.json?.(
        {
          status: 200,
          message: 'successfully get user',
          data: user,
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
  public async getParentByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const parentID = c.params as PickID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!parentID) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const cacheKey = cacheKeys.parent.byID(parentID.id);
      try {
        const cacheParent = await this.redis.get(cacheKey);
        if (cacheParent) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get by parent',
              data: JSON.parse(cacheParent),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const parent = await prisma.user.findFirst({
        where: {
          id: parentID.id,
        },
      });
      if (!parent) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error ',
          },
          400,
        );
      }
      await this.redis.set(cacheKey, JSON.stringify(parent), { EX: 60 }).catch(error);

      return c.json?.(
        {
          status: 200,
          message: 'successfully get parentByID',
          data: parent,
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
  public async getUserByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const userID = c.params as PickID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!userID) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const cacheKey = cacheKeys.user.byID(userID.id);
      try {
        const cacheUser = await this.redis.get(cacheKey);

        if (cacheUser) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get cache redis',
              data: JSON.parse(cacheUser),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const auth = await prisma.user.findUnique({
        where: {
          id: userID.id,
        },
      });

      if (!auth) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(auth), { EX: 60 }).catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get user id',
          data: auth,
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
  public async AllReadyLogin(c: AppContext) {
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
      const session = await prisma.userSession.findFirst({
        where: {
          userId: jwtUser.id,
          expiresAt: { gt: new Date() },
        },
      });
      if (!session) {
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
            message: 'user sedang login',
            data: session,
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
  public async getKader(c: AppContext) {
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
      const cacheKey = cacheKeys.kader.list();
      try {
        const cacheKader = await this.redis.get(cacheKey);
        if (cacheKader) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get kader by cache',
              data: JSON.parse(cacheKader),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const user = await prisma.user.findMany({
        where: {
          role: 'KADER',
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(user), { EX: 60 }).catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get kader',
          data: user,
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
  public async getKaderByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const userID = c.params as PickID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!userID) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const cacheKey = cacheKeys.kader.byID(userID.id);
      try {
        const cacheKaderID = await this.redis.get(cacheKey);
        if (cacheKaderID) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get Kader by Cache',
              data: JSON.parse(cacheKaderID),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const kader = await prisma.user.findUnique({
        where: {
          id: userID.id,
        },
      });

      if (!kader) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(kader), { EX: 60 }).catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get kader by id',
          data: kader,
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

  public async getChildren(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const { posyanduId } = c.query as {
        posyanduId?: string;
      };
      let where: any = {};
      let cacheKey = '';

      if (jwtUser.role === 'PARENT') {
        where.parentId = jwtUser.id;
        cacheKey = cacheKeys.child.byParent(jwtUser.id);
      }

      if (jwtUser.role === 'POSYANDU' || jwtUser.role === 'KADER') {
        if (!posyanduId) {
          return c.json?.({ status: 400, message: 'posyanduId is required' }, 400);
        }

        let authorized = false;

        if (jwtUser.role === 'POSYANDU') {
          const owner = await prisma.posyandu.findFirst({
            where: { id: posyanduId, userID: jwtUser.id },
            select: { id: true },
          });
          authorized = !!owner;
        }

        if (jwtUser.role === 'KADER') {
          const kader = await prisma.kaderRegistration.findFirst({
            where: {
              posyanduId,
              kaderId: jwtUser.id,
              status: 'accepted',
            },
            select: { id: true },
          });
          authorized = !!kader;
        }

        if (!authorized) {
          return c.json?.({ status: 403, message: 'Tidak memiliki akses ke posyandu ini' }, 403);
        }

        where.posyanduId = posyanduId;
        cacheKey = cacheKeys.child.byPosyandu(posyanduId);
      }

      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return c.json?.({ status: 200, message: 'success', data: JSON.parse(cached) }, 200);
      }

      const children = await prisma.child.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          parent: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          posyandu: {
            select: {
              id: true,
              name: true,
            },
          },
          programProgress: true,
        },
      });

      if (!children.length) {
        return c.json?.({ status: 404, message: 'children not found' }, 404);
      }

      await this.redis.set(cacheKey, JSON.stringify(children), { EX: 120 });

      return c.json?.({ status: 200, message: 'success', data: children }, 200);
    } catch (error) {
      console.error('[getChildren]', error);
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

  public async getChildByID(c: AppContext) {
    try {
      const chilParams = c.params as PickChilID;
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
      if (!chilParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      const cacheKey = cacheKeys.child.byID(chilParams.id);
      try {
        const cacheChild = await this.redis.get(cacheKey);

        if (cacheChild) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get cache child',
              data: JSON.parse(cacheChild),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const parent = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });

      if (!parent || parent.role !== 'PARENT') {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }
      const child = await prisma.child.findFirst({
        where: {
          id: chilParams.id,
          parentId: parent.id,
        },
      });

      await this.redis.set(cacheKey, JSON.stringify(child), { EX: 60 }).catch(error);
      if (!child) {
        return c.json?.(
          {
            status: 404,
            message: 'server internal error',
          },
          404,
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: 'successfully get child',
            data: child,
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
}

export default new UserController();
