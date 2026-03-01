import prisma from 'prisma/client';
import { JwtPayload, PickID, PickUpdatePassword, PickUpdateProfile } from '@/types/auth.types';
import { AppContext } from '@/contex/appContex';
import { uploadCloudinary } from '@/utils/clodinary';
import bcrypt from 'bcryptjs';
import { PickChilID } from '@/types/child.types';
import { generateOtp } from '@/utils/generate-otp';
import { sendOTPEmail } from '@/utils/mailer';
import { sanitizeUser } from '@/utils/sanitize';

class UserController {
  public async getProfile(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
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
          take: 1,
        });

        profileData.posyanduId = kaderRegistration?.posyanduId || null;
        profileData.posyanduName = kaderRegistration?.posyandu?.name || null;
      }

      if (user.role === 'POSYANDU') {
        const posyandu = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
          select: {
            posyandu: {
              select: {
                id: true,
              },
            },
          },
        });

        profileData.posyandu = posyandu?.posyandu?.[0] || null;
      }

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

      const isUpdateEmail = typeof user.email === 'string' && user.email.length > 0;
      const isUpdatePhone = typeof user.phone === 'string' && user.phone.length > 0;
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
      return c.json?.(
        {
          status: 201,
          message: 'successfully updated profile',
          data: {
            updateUser: sanitizeUser(updateUser),
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
      }
      return c.json?.(
        {
          status: 200,
          message: 'successfully deleted account',
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
      const usr = c.body as PickUpdatePassword & { oldPassword?: string };

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!usr || !usr.password) {
        return c.json?.(
          {
            status: 400,
            message: 'new password is required',
          },
          400,
        );
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: jwtUser.id },
        select: { password: true },
      });

      if (!currentUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }

      if (currentUser.password) {
        if (!usr.oldPassword) {
          return c.json?.(
            {
              status: 400,
              message: 'old password is required',
            },
            400,
          );
        }
        const isOldPasswordValid = await bcrypt.compare(usr.oldPassword, currentUser.password);
        if (!isOldPasswordValid) {
          return c.json?.(
            {
              status: 400,
              message: 'old password is incorrect',
            },
            400,
          );
        }
      }

      const hashPassword = await bcrypt.hash(usr.password, 10);

      await prisma.user.update({
        where: {
          id: jwtUser.id,
        },
        data: {
          password: hashPassword,
        },
      });

      return c.json?.(
        {
          status: 200,
          message: 'successfully updated password',
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
  public async getParent(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      let posyanduId: string | null = null;

      if (jwtUser.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: { userID: jwtUser.id },
          select: { id: true },
        });
        posyanduId = posyandu?.id ?? null;
      }

      if (jwtUser.role === 'KADER') {
        const kader = await prisma.kaderRegistration.findFirst({
          where: {
            kaderId: jwtUser.id,
            status: 'accepted',
          },
          select: { posyanduId: true },
        });
        posyanduId = kader?.posyanduId ?? null;
      }

      if (jwtUser.role === 'ADMIN') {
        posyanduId = null;
      }

      if (!posyanduId && jwtUser.role !== 'ADMIN') {
        return c.json?.({ status: 403, message: 'Tidak memiliki akses posyandu' }, 403);
      }

      const parents = await prisma.user.findMany({
        where:
          jwtUser.role === 'ADMIN'
            ? { role: 'PARENT' }
            : {
                role: 'PARENT',
                children: {
                  some: {
                    posyanduId,
                  },
                },
              },
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return c.json?.(
        {
          status: 200,
          message: 'successfully get parents',
          data: parents,
        },
        200,
      );
    } catch (error) {
      console.error('[getParent]', error);
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

      const parent = await prisma.user.findFirst({
        where: {
          id: parentID.id,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          avaUrl: true,
          createdAt: true,
          children: {
            include: {
              measurements: {
                select: {
                  nutritionStatus: true,
                },
              },
            },
          },
        },
      });
      if (!parent) {
        return c.json?.(
          {
            status: 404,
            message: 'parent not found',
          },
          404,
        );
      }

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

      const auth = await prisma.user.findUnique({
        where: {
          id: userID.id,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          role: true,
          avaUrl: true,
          isVerify: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!auth) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
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

      const user = await prisma.user.findMany({
        where: {
          role: 'KADER',
        },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          role: true,
          avaUrl: true,
          createdAt: true,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: 'kader not found',
          },
          404,
        );
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

      const kader = await prisma.user.findUnique({
        where: {
          id: userID.id,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          role: true,
          avaUrl: true,
          isVerify: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!kader) {
        return c.json?.(
          {
            status: 404,
            message: 'kader not found',
          },
          404,
        );
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

      if (jwtUser.role === 'PARENT') {
        where.parentId = jwtUser.id;
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
          measurements: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              nutritionStatus: true,
            },
          },
        },
      });

      const formattedChildren = children.map((child) => ({
        ...child,
        measurement: child.measurements[0] ?? null,
        measurements: undefined,
      }));

      return c.json?.({ status: 200, message: 'success', data: formattedChildren }, 200);
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
      if (!chilParams.id) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      const childBase = await prisma.child.findFirst({
        where: { id: chilParams.id },
        select: {
          id: true,
          parentId: true,
          posyanduId: true,
        },
      });

      if (!childBase) {
        return c.json?.(
          {
            status: 404,
            message: 'child not found',
          },
          404,
        );
      }

      const user = await prisma.user.findFirst({
        where: { id: jwtUser.id },
        select: { role: true, id: true },
      });

      if (!user) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (user.role === 'PARENT') {
        if (childBase.parentId !== user.id) {
          return c.json?.(
            {
              status: 403,
              message: 'Forbidden',
            },
            403,
          );
        }
      } else if (user.role === 'POSYANDU') {
        if (!childBase.posyanduId) {
          return c.json?.(
            {
              status: 403,
              message: 'Forbidden',
            },
            403,
          );
        }

        const owner = await prisma.posyandu.findFirst({
          where: { id: childBase.posyanduId, userID: user.id },
          select: { id: true },
        });

        if (!owner) {
          return c.json?.(
            {
              status: 403,
              message: 'Forbidden',
            },
            403,
          );
        }
      } else if (user.role === 'KADER') {
        if (!childBase.posyanduId) {
          return c.json?.(
            {
              status: 403,
              message: 'Forbidden',
            },
            403,
          );
        }

        const kader = await prisma.kaderRegistration.findFirst({
          where: {
            posyanduId: childBase.posyanduId,
            kaderId: user.id,
            status: 'accepted',
          },
          select: { id: true },
        });

        if (!kader) {
          return c.json?.(
            {
              status: 403,
              message: 'Forbidden',
            },
            403,
          );
        }
      } else if (user.role !== 'ADMIN') {
        return c.json?.(
          {
            status: 403,
            message: 'Forbidden',
          },
          403,
        );
      }

      const child = await prisma.child.findFirst({
        where:
          user.role === 'PARENT' ? { id: chilParams.id, parentId: user.id } : { id: chilParams.id },
      });
      if (!child) {
        return c.json?.(
          {
            status: 404,
            message: 'child not found',
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
