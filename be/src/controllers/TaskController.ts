import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateTask, PickTaskProgresID } from '@/types/task.types';
import { getRedis } from '@/utils/redis';
import prisma from 'prisma/client';

class SubtaskController {
  private get redis() {
    return getRedis();
  }
  public async createTask(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const TaskBody = c.body as PickCreateTask;
      const TaskParams = c.params as PickTaskProgresID;

      if (!TaskBody.description || !TaskBody.title) {
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
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!TaskParams) {
        return c.json?.(
          {
            status: 404,
            message: 'params is required',
          },
          404,
        );
      }

      const progres = await prisma.nutritionProgramProgress.findFirst({
        where: {
          programId: TaskParams.progressId,
          isAccep: true,
          program: {
            posyandu: {
              userID: jwtUser.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!progres) {
        return c.json?.(
          {
            status: 403,
            message: 'invalid program Progres or not authorized',
          },
          403,
        );
      }

      const task = await prisma.taskProgram.create({
        data: {
          title: TaskBody.title,
          description: TaskBody.description,
          isComplated: false,
          progresId: progres.id,
        },
      });

      if (!task) {
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
          message: 'succesfully create subtask',
          data: task,
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
  //more api
}

export default new SubtaskController();
