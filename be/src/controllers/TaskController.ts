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
          mealType: TaskBody.mealType,
          targetEnergyKcal: TaskBody.targetEnergyKcal,
          targetProteinGram: TaskBody.targetProteinGram,
          targetFatGram: TaskBody.targetFatGram,
          targetCarbGram: TaskBody.targetCarbGram,
          targetFiberGram: TaskBody.targetFiberGram,
          progresId: progres.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          isBroadcast: true,
          isComplated: true,
          mealType: true,
          targetEnergyKcal: true,
          targetProteinGram: true,
          targetFatGram: true,
          targetCarbGram: true,
          targetFiberGram: true,
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

      await this.redis.del(cacheKeys.task.byProgresId(progres.id));
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
      const params = c.params as PickTaskProgresID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (jwtUser.role !== 'PARENT') {
        return c.json?.({ status: 403, message: 'Forbidden access' }, 403);
      }

      if (!params?.progressId) {
        return c.json?.({ status: 400, message: 'progressId is required' }, 400);
      }

      const cacheKey = cacheKeys.task.byProgresId(params.progressId);

      try {
        const cacheTask = await this.redis.get(cacheKey);
        if (cacheTask) {
          return c.json?.(
            {
              status: 200,
              message: 'successfully get task (cache)',
              data: JSON.parse(cacheTask),
            },
            200,
          );
        }
      } catch (_) {
        // cache failure should NEVER break API
      }

      const progress = await prisma.nutritionProgramProgress.findUnique({
        where: { id: params.progressId },
        select: {
          id: true,
          childId: true,
        },
      });

      if (!progress || !progress.childId) {
        return c.json?.({ status: 404, message: 'Progress not found' }, 404);
      }

      const child = await prisma.child.findFirst({
        where: {
          id: progress.childId,
          parentId: jwtUser.id,
        },
        select: { id: true },
      });

      if (!child) {
        return c.json?.(
          {
            status: 403,
            message: 'You are not allowed to access this progress',
          },
          403,
        );
      }

      const task = await prisma.taskProgram.findMany({
        where: {
          progresId: progress.id,
          isBroadcast: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
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

      if (task.length > 0) {
        await this.redis.set(cacheKey, JSON.stringify(task), { EX: 60 });
      }

      return c.json?.(
        {
          status: 200,
          message: 'successfully get task',
          data: task,
        },
        200,
      );
    } catch (error) {
      console.error('[getTaskForChild]', error);
      return c.json?.(
        {
          status: 500,
          message: 'Internal server error',
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

      await Promise.all([
        this.redis.del(cacheKeys.task.byRole('PARENT')),
        this.redis.del(cacheKeys.task.byRole('POSYANDU')),
        this.redis.del(cacheKeys.task.byRole('KADER')),
      ]).catch(console.error);

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
          mealType: true,
          targetEnergyKcal: true,
          targetProteinGram: true,
          targetFatGram: true,
          targetCarbGram: true,
          targetFiberGram: true,
          createdAt: true,
          progres: {
            select: {
              childId: true,
            },
          },
        },
      });

      if (!task) {
        return c.json?.({ status: 404, message: 'task not found or not authorized' }, 404);
      }

      if (task.isComplated) {
        return c.json?.({ status: 400, message: 'task already completed' }, 400);
      }

      if (!task.progres.childId) {
        return c.json?.({ status: 400, message: 'child id not found' }, 400);
      }

      if (task.mealType && task.targetEnergyKcal) {
        const actualNutrition = await this.calculateMealNutrition(
          task.progres.childId,
          task.mealType,
          task.createdAt,
        );

        const tolerance = 0.9;
        const energyGap = task.targetEnergyKcal - actualNutrition.energyKcal;
        const proteinGap = (task.targetProteinGram || 0) - actualNutrition.proteinGram;

        if (
          actualNutrition.energyKcal < task.targetEnergyKcal * tolerance ||
          actualNutrition.proteinGram < (task.targetProteinGram || 0) * tolerance
        ) {
          return c.json?.(
            {
              status: 422,
              message: 'Nutrition target not met',
              data: {
                taskId: task.id,
                mealType: task.mealType,
                target: {
                  energyKcal: task.targetEnergyKcal,
                  proteinGram: task.targetProteinGram || 0,
                  fatGram: task.targetFatGram || 0,
                  carbGram: task.targetCarbGram || 0,
                  fiberGram: task.targetFiberGram || 0,
                },
                actual: {
                  energyKcal: Math.round(actualNutrition.energyKcal * 100) / 100,
                  proteinGram: Math.round(actualNutrition.proteinGram * 100) / 100,
                  fatGram: Math.round(actualNutrition.fatGram * 100) / 100,
                  carbGram: Math.round(actualNutrition.carbGram * 100) / 100,
                  fiberGram: Math.round(actualNutrition.fiberGram * 100) / 100,
                },
                gap: {
                  energyKcal: Math.round(energyGap * 100) / 100,
                  proteinGram: Math.round(proteinGap * 100) / 100,
                  tolerancePercent: (tolerance * 100).toFixed(0),
                },
              },
            },
            422,
          );
        }
      }

      const doneTask = await prisma.taskProgram.update({
        where: { id: task.id },
        data: { isComplated: true },
      });

      await Promise.all([
        this.redis.del(cacheKeys.task.byRole('PARENT')),
        this.redis.del(cacheKeys.task.byRole('POSYANDU')),
        this.redis.del(cacheKeys.task.byRole('KADER')),
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
      console.error('[doneTask]', error);
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

  private async calculateMealNutrition(
    childId: string,
    mealType: string,
    taskCreatedAt: Date,
  ): Promise<{
    energyKcal: number;
    proteinGram: number;
    fatGram: number;
    carbGram: number;
    fiberGram: number;
  }> {
    const dayStart = new Date(taskCreatedAt);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(taskCreatedAt);
    dayEnd.setHours(23, 59, 59, 999);

    const foodIntakes = await prisma.food.findMany({
      where: {
        childId,
        createdAt: { gte: dayStart, lte: dayEnd },
      },
      include: { items: true },
    });

    const result = {
      energyKcal: 0,
      proteinGram: 0,
      fatGram: 0,
      carbGram: 0,
      fiberGram: 0,
    };

    foodIntakes.forEach((intake) => {
      const determinedMealType = this.determineMealType(intake.createdAt);
      if (determinedMealType === mealType) {
        intake.items.forEach((item) => {
          result.energyKcal += Number(item.energyKcal ?? 0);
          result.proteinGram += Number(item.proteinGram ?? 0);
          result.fatGram += Number(item.fatGram ?? 0);
          result.carbGram += Number(item.carbGram ?? 0);
          result.fiberGram += Number(item.fiberGram ?? 0);
        });
      }
    });

    return result;
  }

  // ✅ Helper: Determine meal type from time of day
  private determineMealType(time: Date): string {
    const hour = time.getHours();
    if (hour >= 5 && hour < 10) return 'BREAKFAST';
    if (hour >= 10 && hour < 14) return 'LUNCH';
    if (hour >= 14 && hour < 18) return 'SNACK';
    return 'DINNER';
  }
}

export default new SubtaskController();
