import { AppContext } from '@/contex/appContex';
import { NotificationService } from '@/service/notifikasi.service';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateTask, PickTaskID, PickTaskProgresID } from '@/types/task.types';
import { ParseUpdateData } from '@/utils/parseUpdateData';
import { NotifType } from '@prisma/client';
import prisma from 'prisma/client';

class SubtaskController {
  public async createTask(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as PickCreateTask;
      const params = c.params as PickTaskProgresID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params) {
        return c.json?.({ status: 400, message: 'params is required' }, 400);
      }

      if (!body?.title || !body?.description) {
        return c.json?.({ status: 400, message: 'body is required' }, 400);
      }

      const user = await prisma.user.findFirst({
        where: { id: jwtUser.id },
        select: { id: true, role: true },
      });

      if (!user) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const progresBase = await prisma.nutritionProgramProgress.findFirst({
        where: {
          programId: params.progressId,
          isAccep: true,
        },
        select: {
          id: true,
          program: {
            select: {
              posyanduId: true,
              posyandu: {
                select: { userID: true },
              },
            },
          },
        },
      });

      if (!progresBase) {
        return c.json?.({ status: 404, message: 'program progres not found' }, 404);
      }

      if (user.role === 'POSYANDU') {
        if (progresBase.program.posyandu?.userID !== user.id) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }
      } else if (user.role === 'KADER') {
        const kader = await prisma.kaderRegistration.findFirst({
          where: {
            posyanduId: progresBase.program.posyanduId,
            kaderId: user.id,
            status: 'accepted',
          },
          select: { id: true },
        });

        if (!kader) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }
      } else if (user.role !== 'ADMIN') {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      const task = await prisma.taskProgram.create({
        data: {
          title: body.title,
          description: body.description,
          isComplated: false,
          isBroadcast: body.isBroadcast,
          mealType: body.mealType,
          targetEnergyKcal: body.targetEnergyKcal,
          targetProteinGram: body.targetProteinGram,
          targetFatGram: body.targetFatGram,
          targetCarbGram: body.targetCarbGram,
          targetFiberGram: body.targetFiberGram,
          progresId: progresBase.id,
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

      return c.json?.(
        {
          status: 200,
          message: 'successfully create task',
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
      const body = c.body as PickCreateTask;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.id) {
        return c.json?.({ status: 400, message: 'params is required' }, 400);
      }

      const user = await prisma.user.findFirst({
        where: { id: jwtUser.id },
        select: { id: true, role: true },
      });

      if (!user) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const taskBase = await prisma.taskProgram.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          isBroadcast: true,
          progres: {
            select: {
              program: {
                select: {
                  posyanduId: true,
                  posyandu: { select: { userID: true } },
                },
              },
            },
          },
        },
      });

      if (!taskBase) {
        return c.json?.({ status: 404, message: 'task not found' }, 404);
      }

      if (taskBase.isBroadcast) {
        return c.json?.({ status: 400, message: 'task already broadcast' }, 400);
      }

      if (user.role === 'POSYANDU') {
        if (taskBase.progres.program.posyandu?.userID !== user.id) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }
      } else if (user.role === 'KADER') {
        const kader = await prisma.kaderRegistration.findFirst({
          where: {
            posyanduId: taskBase.progres.program.posyanduId,
            kaderId: user.id,
            status: 'accepted',
          },
          select: { id: true },
        });

        if (!kader) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }
      } else if (user.role !== 'ADMIN') {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      const payload = ParseUpdateData(body);
      const updatedTask = await prisma.taskProgram.update({
        where: { id: params.id },
        data: payload,
      });

      return c.json?.(
        {
          status: 200,
          message: 'successfully update task',
          data: updatedTask,
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

  public async deleteTask(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickTaskID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.id) {
        return c.json?.({ status: 400, message: 'params is required' }, 400);
      }

      const user = await prisma.user.findFirst({
        where: { id: jwtUser.id },
        select: { id: true, role: true },
      });

      if (!user) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const taskBase = await prisma.taskProgram.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          isBroadcast: true,
          progres: {
            select: {
              program: {
                select: {
                  posyanduId: true,
                  posyandu: { select: { userID: true } },
                },
              },
            },
          },
        },
      });

      if (!taskBase) {
        return c.json?.({ status: 404, message: 'task not found' }, 404);
      }

      if (taskBase.isBroadcast) {
        return c.json?.({ status: 403, message: 'task already broadcast' }, 403);
      }

      if (user.role === 'POSYANDU') {
        if (taskBase.progres.program.posyandu?.userID !== user.id) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }
      } else if (user.role === 'KADER') {
        const kader = await prisma.kaderRegistration.findFirst({
          where: {
            posyanduId: taskBase.progres.program.posyanduId,
            kaderId: user.id,
            status: 'accepted',
          },
          select: { id: true },
        });

        if (!kader) {
          return c.json?.({ status: 403, message: 'Forbidden' }, 403);
        }
      } else if (user.role !== 'ADMIN') {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      const deletedTask = await prisma.taskProgram.delete({
        where: { id: params.id },
      });

      return c.json?.(
        {
          status: 200,
          message: 'successfully delete task',
          data: deletedTask,
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
      const task = await prisma.taskProgram.findMany({
        where: {
          isBroadcast: false,
        },
        include: {
          progres: {
            select: {
              child: {
                select: {
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
            message: 'server error',
          },
          400,
        );
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
