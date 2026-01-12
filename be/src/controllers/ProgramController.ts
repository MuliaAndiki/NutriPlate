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
      const body = c.body as PickCreateProgram;
      const params = c.params as PickPosyanduID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!body.name || !body.description || !body.durationRegister || !body.endPrograms) {
        return c.json?.(
          { status: 400, message: 'name, description, durationRegister, endPrograms required' },
          400,
        );
      }

      if (new Date(body.endPrograms) <= new Date(body.durationRegister)) {
        return c.json?.(
          { status: 400, message: 'endPrograms must be after durationRegister' },
          400,
        );
      }

      const posyandu = await prisma.posyandu.findUnique({
        where: { id: params.id },
      });

      if (!posyandu) {
        return c.json?.({ status: 404, message: 'posyandu not found' }, 404);
      }

      const user = await prisma.user.findUnique({
        where: { id: jwtUser.id },
        select: { id: true, role: true },
      });

      if (!user || user.role !== 'POSYANDU') {
        return c.json?.({ status: 403, message: 'access denied' }, 403);
      }

      const program = await prisma.nutriplateProgram.create({
        data: {
          name: body.name,
          description: body.description,
          durationRegister: new Date(body.durationRegister),
          endPrograms: new Date(body.endPrograms),
          activity: body.activity,
          benefit: body.benefit,
          posyanduId: posyandu.id,
          userId: user.id,
          startPrograms: null,
        },
      });

      return c.json?.(
        {
          status: 200,
          message: 'successfully created nutriplate program',
          data: program,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'internal server error',
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
            status: 401,
            message: 'Unauthorized',
          },
          401,
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
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const user = await prisma.user.findFirst({
        where: { id: jwtUser.id },
        select: { id: true, role: true },
      });

      if (!user) {
        return c.json?.({ status: 404, message: 'user not found' }, 404);
      }
      let whereConditional: any = {};
      let cacheKey = '';

      if (user.role === 'PARENT') {
        const child = await prisma.child.findFirst({
          where: { parentId: user.id },
          select: { posyanduId: true },
        });

        if (!child || !child.posyanduId) {
          return c.json?.({ status: 404, message: 'child or posyandu not found' }, 404);
        }

        whereConditional.posyanduId = child.posyanduId;
        cacheKey = cacheKeys.program.byPosyandu(child.posyanduId);
      } else if (user.role === 'POSYANDU' || user.role === 'KADER') {
        const posyandu = await prisma.posyandu.findFirst({
          where: { userID: user.id },
          select: { id: true },
        });

        if (!posyandu) {
          return c.json?.({ status: 404, message: 'posyandu not found' }, 404);
        }

        whereConditional.posyanduId = posyandu.id;
        cacheKey = cacheKeys.program.byPosyandu(posyandu.id);
      } else {
        return c.json?.({ status: 403, message: 'forbidden role' }, 403);
      }

      try {
        const cachePrograms = await this.redis.get(cacheKey);
        if (cachePrograms) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get programs (cache)',
              data: JSON.parse(cachePrograms),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db: ${error}`);
      }

      const programs = await prisma.nutriplateProgram.findMany({
        where: whereConditional,
        orderBy: { createdAt: 'asc' },
      });

      if (!programs || programs.length === 0) {
        return c.json?.({ status: 404, message: 'programs not found' }, 404);
      }

      await this.redis.set(cacheKey, JSON.stringify(programs), { EX: 60 }).catch(console.error);

      return c.json?.(
        {
          status: 200,
          message: 'successfully get programs',
          data: programs,
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
            status: 401,
            message: 'Unauthorized',
          },
          401,
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

      const program = await prisma.nutriplateProgram.findFirst({
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
            status: 401,
            message: 'Unauthorized',
          },
          401,
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
