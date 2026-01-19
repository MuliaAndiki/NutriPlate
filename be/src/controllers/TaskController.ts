import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { NotificationService } from '@/service/notifikasi.service';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateTask, PickTaskID, PickTaskProgresID } from '@/types/task.types';
import { ParseUpdateData } from '@/utils/parseUpdateData';
import { getRedis } from '@/utils/redis';
import { NotifType } from '@prisma/client';
import { error } from 'console';
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
          isBroadcast: TaskBody.isBroadcast,
          progresId: progres.id,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          isBroadcast: true,
          isComplated: true,
          progres: {
            select: {
              id: true,
              child: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
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
  public async getTaskForChild(c: AppContext) {
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
      const user = jwtUser;

      if (!user || user.role !== 'PARENT') {
        return c.json?.(
          {
            status: 400,
            message: 'user cant not accest',
          },
          400,
        );
      }

      const program = await prisma.nutriplateProgram.findFirst({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!program) {
        return c.json?.({
          status: 404,
          message: 'program not found',
        });
      }

      const progres = await prisma.nutritionProgramProgress.findFirst({
        where: {
          programId: program.id,
          isAccep: true,
        },
        select: {
          id: true,
        },
      });

      if (!progres) {
        return c.json?.({
          status: 404,
          message: 'program not found',
        });
      }

      const cacheKey = cacheKeys.task.byRole(user.role);

      try {
        const cacheTask = await this.redis.get(cacheKey);

        if (cacheTask) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get task child',
              data: JSON.parse(cacheTask),
            },
            200,
          );
        }
      } catch (error) {}

      const task = await prisma.taskProgram.findMany({
        where: {
          progresId: progres.id,
          isBroadcast: true,
        },
        include: {
          progres: {
            include: {
              child: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
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

      if (task && task.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(task), { EX: 60 });
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfully get task',
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
  public async updateTask(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickTaskID;
      const TaskBody = c.body as PickCreateTask;
      if (!params) {
        return c.json?.(
          {
            status: 404,
            message: 'params is required',
          },
          404,
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
      const posyandu = await prisma.posyandu.findFirst({
        where: {
          userID: jwtUser.id,
        },
        include: {
          children: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      });

      if (!posyandu || jwtUser.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'posyandu not found & forebaiden',
          },
          403,
        );
      }
      const cacheKey = cacheKeys.task.byID(params.id);

      const buildPayload = ParseUpdateData(TaskBody);
      const updateTask = await prisma.taskProgram.update({
        where: {
          id: params.id,
          isBroadcast: false,
        },
        data: buildPayload,
      });

      if (!updateTask) {
        return c.json?.(
          {
            status: 400,
            message: 'server error & task already boardcast',
          },
          400,
        );
      } else {
        await this.redis.del(cacheKey).catch(error);
      }

      return c.json?.(
        {
          status: 201,
          message: 'succesfully update task',
          data: updateTask,
        },
        201,
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
  public async deleteTask(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickTaskID;
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
            status: 404,
            message: 'params is required',
          },
          404,
        );
      }

      const cacheKey = cacheKeys.task.byID(params.id);
      const posyandu = await prisma.posyandu.findFirst({
        where: {
          userID: jwtUser.id,
        },
        select: {
          id: true,
        },
      });

      if (!posyandu || jwtUser.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'posyandu not found & forebaiden',
          },
          403,
        );
      }

      const deleteTask = await prisma.taskProgram.delete({
        where: {
          id: params.id,
          isBroadcast: false,
        },
      });

      if (!deleteTask) {
        return c.json?.(
          {
            status: 403,
            message: 'server error & task already broadcast',
          },
          403,
        );
      } else {
        await this.redis.del(cacheKey).catch(error);
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully delete task',
          data: deleteTask,
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
  public async getTaskNotBroadCast(c: AppContext) {
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
      const cacheKey = cacheKeys.task.list();

      try {
        const cache = await this.redis.get(cacheKey);
        if (cache) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get cache',
              data: JSON.parse(cache),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback db ${error}`);
      }

      const task = await prisma.taskProgram.findMany({
        where: {
          isBroadcast: false,
        },
        take: 10,
      });

      if (!task) {
        return c.json?.(
          {
            status: 400,
            message: 'server error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(task), { EX: 60 });
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get task not brodcast',
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

  // not fix

  public async broadcastTasks(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as { taskIds: string[] };

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (jwtUser.role !== 'POSYANDU') {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      if (!body?.taskIds || body.taskIds.length === 0) {
        return c.json?.({ status: 400, message: 'taskIds is required' }, 400);
      }

      const posyandu = await prisma.posyandu.findFirst({
        where: { userID: jwtUser.id },
        select: { id: true },
      });

      if (!posyandu) {
        return c.json?.({ status: 403, message: 'posyandu not found' }, 403);
      }

      const tasks = await prisma.taskProgram.findMany({
        where: {
          id: { in: body.taskIds },
          isBroadcast: false,
        },
        include: {
          progres: {
            include: {
              program: {
                select: {
                  userId: true,
                },
              },
              child: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
      });

      if (tasks.length === 0) {
        return c.json?.({ status: 400, message: 'no valid task to broadcast' }, 400);
      }

      const updated = await prisma.taskProgram.updateMany({
        where: {
          id: { in: tasks.map((t) => t.id) },
          isBroadcast: false,
        },
        data: {
          isBroadcast: true,
        },
      });

      const parentIds = new Set(tasks.map((t) => t.progres.program.userId));

      for (const parentId of parentIds) {
        await NotificationService.notify({
          userId: parentId,
          title: 'Tugas Baru',
          message: `Ada ${tasks.length} tugas baru dari posyandu`,
          type: NotifType.alert,
          isBroadcast: true,
        });
      }

      await this.redis.del(cacheKeys.task.byRole('PARENT')).catch(console.error);

      return c.json?.(
        {
          status: 200,
          message: 'tasks successfully broadcast',
          affected: updated.count,
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

  public async doneTask(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickTaskID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (jwtUser.role !== 'PARENT') {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      if (!params?.id) {
        return c.json?.({ status: 400, message: 'task id is required' }, 400);
      }

      const task = await prisma.taskProgram.findFirst({
        where: {
          id: params.id,
          isBroadcast: true,
          progres: {
            program: {
              userId: jwtUser.id,
            },
          },
        },
        select: {
          id: true,
          isComplated: true,
          progresId: true,
        },
      });

      if (!task) {
        return c.json?.({ status: 404, message: 'task not found or not authorized' }, 404);
      }

      if (task.isComplated) {
        return c.json?.({ status: 400, message: 'task already completed' }, 400);
      }

      const doneTask = await prisma.taskProgram.update({
        where: { id: task.id },
        data: { isComplated: true },
      });

      await Promise.all([
        this.redis.del(cacheKeys.task.byRole('PARENT')),
        this.redis.del(cacheKeys.progress.byChild(task.progresId)),
      ]).catch(console.error);

      return c.json?.(
        {
          status: 200,
          message: 'task completed successfully',
          data: doneTask,
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

  // Done Task (Parent)
  //
}

export default new SubtaskController();
