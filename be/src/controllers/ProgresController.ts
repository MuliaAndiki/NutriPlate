import app from '@/app';
import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import {
  PickAssingPrograms,
  PickCancelPrograms,
  PickProgramProgresID,
} from '@/types/programNutritionProgres.types';
import { getRedis } from '@/utils/redis';
import { error } from 'console';
import prisma from 'prisma/client';

class ProgresController {
  private get redis() {
    return getRedis();
  }
  public async assingProgramChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const progresBody = c.body as PickAssingPrograms;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      if (!Array.isArray(progresBody.childId) || !progresBody.dayNumber || !progresBody.programId) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }
      const posyandu = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
        },
      });
      if (!posyandu || posyandu.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'server error & cant no acces role',
          },
          403,
        );
      }
      const program = await prisma.nutriplateProgram.findFirst({
        where: {
          id: progresBody.programId,
        },
        select: {
          durationDays: true,
        },
      });

      if (!program || program.durationDays < progresBody.dayNumber) {
        return c.json?.(
          {
            status: 400,
            message: 'invalid programs, durationDay more than dayNumber',
          },
          400,
        );
      }

      const data = progresBody.childId.map((childId) => ({
        programId: progresBody.programId,
        dayNumber: progresBody.dayNumber,
        childId,
      }));

      const result = await prisma.nutritionProgramProgress.createMany({
        data,
        skipDuplicates: true,
      });
      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'Program:assing',
          payload: result,
        }),
      );
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
            status: 201,
            message: 'succesfully assing',
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
  public async getChildInProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 400,
            message: 'user not found',
          },
          400,
        );
      }
      //   Ilmu
      let childrenIds: string[] = [];

      if (user.role === 'PARENT') {
        const children = await prisma.child.findMany({
          where: {
            parentId: user.id,
          },
          select: {
            id: true,
          },
        });

        childrenIds = children.map((c) => c.id);
      }

      if (user.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: {
            userID: user.id,
          },
          select: {
            id: true,
          },
        });

        if (!posyandu) {
          return c.json?.({ status: 404, message: 'posyandu not found' }, 404);
        }

        const children = await prisma.child.findMany({
          where: {
            posyanduId: posyandu.id,
          },
          select: {
            id: true,
          },
        });

        childrenIds = children.map((c) => c.id);
      }
      const cacheKey = cacheKeys.progres.byRole(jwtUser.role);

      try {
        const cacheProgres = await this.redis.get(cacheKey);
        if (cacheProgres) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get by child',
              data: JSON.parse(cacheProgres),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }
      const progres = await prisma.nutritionProgramProgress.findMany({
        where: {
          childId: {
            in: childrenIds,
          },
          isCompleted: false,
        },
        include: {
          child: {
            select: {
              id: true,
              fullName: true,
            },
          },
          program: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!progres) {
        return c.json?.({
          status: 400,
          message: 'server internal error',
        });
      } else if (progres && progres.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(progres), { EX: 60 }).catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get all child in progress',
          data: progres,
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
  public async cancelChildProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickProgramProgresID;
      const prog = c.body as PickCancelPrograms;

      if (!prog) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
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

      const child = await prisma.child.findFirst({
        where: {
          id: prog.childId,
        },
        select: {
          id: true,
        },
      });
      if (!child) {
        return c.json?.(
          {
            status: 400,
            message: 'child not found',
          },
          400,
        );
      }
      //   Redis Not Fix
      //   debug nanti
      const cacheKey = (cacheKeys.progres.byID(params.id), cacheKeys.progres.byRole(jwtUser.role));
      const progress = await prisma.nutritionProgramProgress.delete({
        where: {
          childId: child.id,
          id: params.id,
        },

        include: {
          program: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await this.redis.del(cacheKey).catch(error);
      if (!progress) {
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
          data: progress,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internale error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async getHistoryChildProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
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
            status: 400,
            message: 'user not found',
          },
          400,
        );
      }
      //  Ilmu
      let whereCondicional: any = {
        isCompleted: true,
      };

      if (user.role === 'PARENT') {
        whereCondicional.id = user.id;
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
              message: 'posyandu not found',
            },
            404,
          );
        }

        whereCondicional.child = {
          posyanduId: posyandu.id,
        };
      }

      const cacheKey = cacheKeys.history.byRole(user.role);

      try {
        const cacheHistory = await this.redis.get(cacheKey);
        if (cacheHistory) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfuly get history by cache',
              data: JSON.parse(cacheHistory),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const history = await prisma.nutritionProgramProgress.findMany({
        where: whereCondicional,
        include: {
          child: {
            select: {
              id: true,
              fullName: true,
            },
          },
          program: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (!history || history.length === 0) {
        return c.json?.(
          {
            status: 404,
            message: 'children not found',
          },
          404,
        );
      }
      if (history && history.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(history), { EX: 60 }).catch(error);
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly get history',
          data: history,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internale error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
}
export default new ProgresController();
