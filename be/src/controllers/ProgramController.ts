import app from '@/app';
import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickPosyanduID } from '@/types/posyandu.types';
import { PickCreateProgram, PickProgramID } from '@/types/programNutriPlate.types';
import { getRedis } from '@/utils/redis';
import { error } from 'console';
import prisma from 'prisma/client';
class ProgramController {
  private get redis() {
    return getRedis();
  }
  public async createProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const prog = c.body as PickCreateProgram;
      const progParams = c.params as PickPosyanduID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      if (!prog.description || !prog.durationDays || !prog.name) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          40,
        );
      }

      if (!progParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const posyandu = await prisma.posyandu.findFirst({
        where: {
          id: progParams.id,
        },
      });

      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'posyandu is missing',
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

      if (!user || user.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'failed posyandu not found ',
          },
          403,
        );
      }
      const program = await prisma.nutriplateProgram.create({
        data: {
          name: prog.name,
          description: prog.description,
          durationDays: prog.durationDays,
          posyanduId: posyandu.id,
          userId: user.id,
        },
      });

      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'programs:create',
          payload: program,
        }),
      );

      if (!program) {
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
            message: 'succesfully create programs',
            data: program,
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
  public async updateProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const prog = c.body as PickCreateProgram;
      const progParams = c.params as PickProgramID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          400,
        );
      }
      if (!progParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      const programs = await prisma.nutriplateProgram.findFirst({
        where: {
          id: progParams.id,
        },
        select: {
          posyandu: true,
          id: true,
        },
      });
      if (!programs || !programs.posyandu) {
        return c.json?.(
          {
            status: 400,
            message: 'program not registered',
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
        },
      });
      if (!user || user.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'user not found & not acces',
          },
          403,
        );
      }
      const cacheKey = cacheKeys.program.byID(programs.id);

      const programUpdate = await prisma.nutriplateProgram.update({
        where: {
          id: programs.id,
        },
        data: {
          ...prog,
        },
      });
      await this.redis.del(cacheKey).catch(error);
      app.server?.publish(
        `user:${jwtUser.id}`,
        JSON.stringify({
          type: 'programs:update',
          payload: programUpdate,
        }),
      );
      if (!programUpdate) {
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
          message: 'succesfully update programs',
          data: programUpdate,
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
  public async getPrograms(c: AppContext) {
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
            message: 'server error ',
          },
          403,
        );
      }

      const cacheKey = cacheKeys.program.list();

      try {
        const cachePrograms = await this.redis.get(cacheKey);
        if (cachePrograms) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get by programs',
              data: JSON.parse(cachePrograms),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db :${error}`);
      }
      const program = await prisma.nutriplateProgram.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      if (!program) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error,',
          },
          400,
        );
      } else if (program && program.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(program), { EX: 60 }).catch(error);
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfully get programs',
          data: program,
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
  public async getProgrambyID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const progParams = c.params as PickProgramID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      if (!progParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const cacheKey = cacheKeys.program.byID(progParams.id);
      try {
        const cachePrograms = await this.redis.get(cacheKey);
        if (cachePrograms) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get programs by id',
              data: JSON.parse(cachePrograms),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }

      const program = await prisma.nutriplateProgram.findUnique({
        where: {
          id: progParams.id,
        },
      });
      if (!program) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(program), { EX: 60 }).catch(error);
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfully get program id',
          data: program,
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
  public async deleteProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const progParams = c.params as PickProgramID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: 'user not found',
          },
          404,
        );
      }
      if (!progParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const prog = await prisma.nutriplateProgram.findFirst({
        where: {
          id: progParams.id,
        },
        select: {
          id: true,
        },
      });
      if (!prog) {
        return c.json?.(
          {
            status: 404,
            message: 'programs not found',
          },
          404,
        );
      }
      const cacheKey = cacheKeys.program.byID(prog.id);
      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
        },
      });
      if (!user || user.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'server error & providen acces',
          },
          403,
        );
      }
      const program = await prisma.nutriplateProgram.delete({
        where: {
          id: prog.id,
        },
      });

      if (!program) {
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
          message: 'succesfuly delete programs',
          data: program,
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
export default new ProgramController();
