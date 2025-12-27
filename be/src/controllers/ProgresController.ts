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
import { tr } from 'zod/locales';

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
          isAccep: true,
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
  public async accepProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const progresParams = c.params as PickProgramProgresID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      if (!progresParams) {
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
          id: true,
          role: true,
        },
      });

      if (!parent || parent.role !== 'PARENT') {
        return c.json?.(
          {
            status: 403,
            message: "server error & can't not acces",
          },
          403,
        );
      }

      const progres = await prisma.nutritionProgramProgress.findUnique({
        where: {
          id: progresParams.id,
        },
        include: {
          child: {
            select: {
              parentId: true,
            },
          },
        },
      });

      if (!progres) {
        return c.json?.(
          {
            status: 404,
            meesage: 'progress not Found',
          },
          404,
        );
      }
      if (progres.child?.parentId !== jwtUser.id) {
        return c.json?.(
          {
            status: 403,
            message: 'not your child',
          },
          403,
        );
      }

      const cacheKey = cacheKeys.progres.byID(progres.id);
      const patch = await prisma.nutritionProgramProgress.update({
        where: {
          id: progresParams.id,
        },
        data: {
          isAccep: true,
        },
      });

      if (!patch) {
        return c.json?.(
          {
            status: 400,
            message: 'server internale error',
          },
          400,
        );
      } else {
        await this.redis.del(cacheKey);
      }

      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'Program:patch',
          payload: patch,
        }),
      );

      return c.json?.(
        {
          status: 200,
          message: 'program accepted',
          data: patch,
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
  public async getAccepProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'unauthorized',
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
      let whereCondicional: any = {};
      if (user.role === 'PARENT') {
        const parent = user.id;
        if (!parent) {
          return c.json?.(
            {
              status: 404,
              message: 'user not found',
            },
            404,
          );
        }
        const child = await prisma.child.findFirst({
          where: {
            parentId: parent,
          },
          select: {
            id: true,
          },
        });
        if (!child) {
          return c.json?.(
            {
              status: 404,
              message: 'child not found',
            },
            404,
          );
        }
        const progres = await prisma.nutritionProgramProgress.findMany({
          where: {
            isCompleted: false,
            childId: child.id,
          },
          select: {
            id: true,
            isAccep: true,
          },
        });

        whereCondicional = progres.map((c) => c.id);
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
          return c.json?.({
            status: 404,
            message: 'posyandu not found',
          });
        }
        const program = await prisma.nutriplateProgram.findFirst({
          where: {
            posyanduId: posyandu.id,
          },
          select: {
            id: true,
          },
        });
        if (!program) {
          return c.json?.(
            {
              status: 404,
              message: 'program not found',
            },
            404,
          );
        }
        const progres = await prisma.nutritionProgramProgress.findMany({
          where: {
            programId: program.id,
            isCompleted: false,
          },
          select: {
            id: true,
            isAccep: true,
          },
        });
        whereCondicional = progres.map((c) => c.id);
      }

      const cacheKey = cacheKeys.progres.byRole(user.role);

      try {
        const cacheAccep = await this.redis.get(cacheKey);
        if (cacheAccep) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get all accep by cache',
              data: JSON.parse(cacheAccep),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db`);
      }

      const accep = await prisma.nutritionProgramProgress.findMany({
        where: {
          id: {
            in: whereCondicional,
          },
        },
        include: {
          child: {
            select: {
              id: true,
              parentId: true,
              fullName: true,
            },
          },
          program: {
            select: {
              id: true,
              posyanduId: true,
            },
          },
        },
      });

      if (!accep) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      if (accep && accep.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(accep), { EX: 60 });
      }

      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'Program:accepted',
          payload: accep,
        }),
      );
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get all Accepted',
          data: accep,
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
export default new ProgresController();
