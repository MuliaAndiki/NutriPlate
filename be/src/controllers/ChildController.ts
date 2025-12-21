import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickChilID, PickCreateChild } from '@/types/child.types';
import { PickPosyanduID } from '@/types/posyandu.types';
import { getRedis } from '@/utils/redis';
import { error } from 'console';
import prisma from 'prisma/client';

class ChildController {
  private get redis() {
    return getRedis();
  }

  public async createChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childBody = c.body as PickCreateChild;
      const posyanduID = c.params as PickPosyanduID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      if (
        !childBody.dateOfBirth ||
        !childBody.fullname ||
        !childBody.gender ||
        !childBody.photoUrl
      ) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }

      if (!posyanduID) {
        return c.json?.(
          {
            status: 400,
            message: 'posyandu not found',
          },
          400,
        );
      }

      const child = await prisma.child.create({
        data: {
          fullName: childBody.fullname,
          dateOfBirth: childBody.dateOfBirth,
          gender: childBody.gender,
          parentId: jwtUser.id,
          posyanduId: posyanduID.id,
          profileChild: typeof childBody.profileChild,
        },
      });
      if (!child) {
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
            message: 'succesfully create Child',
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
  public async updateChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childID = c.params as PickChilID;
      const childBody = c.body as PickCreateChild;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 400,
            message: 'user not found',
          },
          400,
        );
      }
      if (!childID) {
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
            status: 404,
            message: 'role not valid',
          },
          404,
        );
      }

      const child = await prisma.child.update({
        where: {
          id: childID.id,
          parentId: parent.id,
        },
        data: {
          fullName: childBody.fullname,
          dateOfBirth: childBody.dateOfBirth,
          gender: childBody.gender,
          parentId: jwtUser.id,
          profileChild: typeof childBody.profileChild,
        },
      });

      const cacheKey = [cacheKeys.child.byID(childID.id), cacheKeys.child.byRole(parent.role)];
      if (!child) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }
      const delet = await this.redis.del(cacheKey).catch(error);
      console.log('key redis', delet);
      return c.json?.(
        {
          status: 200,
          message: 'succesfully update child',
          data: child,
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
  public async deleteChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childID = c.params as PickChilID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          400,
        );
      }
      if (!childID) {
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
            status: 403,
            message: 'server internal error & role not acces',
          },
          403,
        );
      }
      const cacheKey = [cacheKeys.child.byRole(parent.role), cacheKeys.child.byID(childID.id)];

      const child = await prisma.child.delete({
        where: {
          id: childID.id,
          parentId: parent.id,
        },
      });
      const deletd = await this.redis.del(cacheKey).catch(error);
      console.log('Redis keys deleted:', deletd);
      if (!child) {
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
          message: 'succesfully delete child',
          data: child,
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

export default new ChildController();
