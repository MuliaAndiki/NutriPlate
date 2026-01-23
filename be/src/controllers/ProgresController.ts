import app from '@/app';
import { cacheKeys } from '@/cache/cacheKey';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import {
  PickAssingPrograms,
  PickPorgramChildId,
  PickProgramProgresID,
} from '@/types/programNutritionProgres.types';
import { PickCreateProgramRegistration } from '@/types/programRegistration.types';
import { getRedis } from '@/utils/redis';
import programRegistrationService from '@/service/programRegistration.service';
import { NotificationService } from '@/service/notifikasi.service';
import { NotifType } from '@prisma/client';
import prisma from 'prisma/client';

class ProgresController {
  private get redis() {
    return getRedis();
  }
  // Assign children to program logic (bulk assignment by POSYANDU)
  private async assignChildrenToProgramBulk(c: AppContext, jwtUser: JwtPayload) {
    try {
      const progresBody = c.body as PickAssingPrograms;
      if (!Array.isArray(progresBody.childId) || !progresBody.programId) {
        return c.json?.(
          {
            status: 400,
            message: 'childId (array) dan programId harus diisi',
          },
          400,
        );
      }

      const program = await prisma.nutriplateProgram.findFirst({
        where: {
          id: progresBody.programId,
          posyandu: {
            userID: jwtUser.id,
          },
        },
        select: {
          id: true,
          name: true,
          startPrograms: true,
          endPrograms: true,
          posyanduId: true,
        },
      });

      if (!program || !program.startPrograms || !program.endPrograms) {
        return c.json?.({ status: 400, message: 'program tidak aktif atau tidak valid' }, 400);
      }

      const now = new Date();
      if (now < program.startPrograms) {
        return c.json?.(
          {
            status: 400,
            message: 'program belum dimulai',
          },
          400,
        );
      }

      if (now > program.endPrograms) {
        return c.json?.(
          {
            status: 400,
            message: 'program sudah berakhir',
          },
          400,
        );
      }

      const children = await prisma.child.findMany({
        where: {
          id: {
            in: progresBody.childId,
          },
          posyanduId: program.posyanduId,
        },
        select: {
          id: true,
          parentId: true,
        },
      });

      if (children.length !== progresBody.childId.length) {
        return c.json?.(
          { status: 400, message: 'beberapa anak tidak valid atau tidak termasuk posyandu ini' },
          400,
        );
      }

      const data = progresBody.childId.map((childId) => ({
        programId: progresBody.programId,
        childId: childId,
      }));

      const result = await prisma.nutritionProgramProgress.createMany({
        data,
        skipDuplicates: true,
      });

      for (const child of children) {
        await NotificationService.notify({
          userId: child.parentId,
          type: NotifType.reminder,
          title: 'Program Nutrisi Baru',
          message: `Anak Anda telah ditambahkan ke program "${program.name}". Mohon untuk dikonfirmasi.`,
        });
      }

      await this.redis.del([
        cacheKeys.progress.byRole('POSYANDU'),
        cacheKeys.progress.byRole('PARENT'),
      ]);

      return c.json?.(
        {
          status: 201,
          message: 'Anak berhasil ditugaskan ke program',
          data: result,
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
  public async getChildInProgram(c: AppContext) {
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
      let cacheKey = '';
      if (user.role === 'PARENT') {
        cacheKey = cacheKeys.progress.byRole('PARENT:' + user.id);
      } else if (user.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: { userID: user.id },
          select: { id: true },
        });
        cacheKey = cacheKeys.progress.byRole('POSYANDU:' + (posyandu?.id || ''));
      }

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
          subtask: true,
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
        const progresWithSummary = progres.map((prog) => {
          const totalTask = prog.subtask.length;
          const completeTask = prog.subtask.filter((task) => task.isComplated === true).length;
          const percentage = totalTask > 0 ? Math.round((completeTask / totalTask) * 100) : 0;
          const remainingTask = totalTask - completeTask;
          const status =
            percentage === 100 ? 'COMPLETED' : percentage > 0 ? 'ON_PROGRESS' : 'NOT_STARTED';
          const isComplated = percentage === 100;

          return {
            ...prog,
            isComplated,
            progressSummary: {
              totalTask,
              completeTask,
              remainingTask,
              percentage,
              status,
            },
          };
        });

        await this.redis
          .set(cacheKey, JSON.stringify(progresWithSummary), { EX: 60 })
          .catch(console.error);

        return c.json?.(
          {
            status: 200,
            message: 'succesfully get all child in progress',
            data: progresWithSummary,
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

  public async getChildInProgramByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPorgramChildId;

      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
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

      const cacheKey = cacheKeys.progress.byChild(params.childId);
      try {
        const cache = await this.redis.get(cacheKey);
        if (cache) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get ChildInProgres (cache)',
              data: JSON.parse(cache),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback Db ${error}`);
      }

      const progres = await prisma.nutritionProgramProgress.findFirst({
        where: {
          childId: params.childId,
        },
        include: {
          child: true,
          program: true,
          subtask: true,
        },
      });

      if (!progres) {
        return c.json?.(
          {
            status: 400,
            message: 'server error',
          },
          400,
        );
      }

      const totalTask = progres.subtask.length;
      const completeTask = progres.subtask.filter((task) => task.isComplated === true).length;
      const percentage = totalTask > 0 ? Math.round((completeTask / totalTask) * 100) : 0;
      const remainingTask = totalTask - completeTask;
      const status =
        percentage === 100 ? 'COMPLETED' : percentage > 0 ? 'ON_PROGRESS' : 'NOT_STARTED';
      const isComplated = percentage === 100;
      const responeData = {
        ...progres,
        isComplated,
        progressSummary: {
          totalTask,
          completeTask,
          remainingTask,
          percentage,
          status,
        },
      };

      await this.redis.set(cacheKey, JSON.stringify(responeData), { EX: 60 });

      return c.json?.(
        {
          status: 200,
          message: 'succesfully get child in progres',
          data: responeData,
        },
        200,
      );
    } catch (error) {
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
      const prog = c.body as PickPorgramChildId;

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
            status: 401,
            message: 'Unauthorized',
          },
          401,
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
      const cacheKey = [
        cacheKeys.progress.byID(params.id),
        cacheKeys.progress.byRole(jwtUser.role),
      ];
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

      await this.redis.del(cacheKey).catch(console.error);
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
            status: 401,
            message: 'Unauthorized',
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

      let cacheKey = '';
      if (user.role === 'PARENT') {
        cacheKey = cacheKeys.history.byRole('PARENT:' + user.id);
      } else if (user.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: { userID: user.id },
          select: { id: true },
        });
        cacheKey = cacheKeys.history.byRole('POSYANDU:' + (posyandu?.id || ''));
      }

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
        await this.redis.set(cacheKey, JSON.stringify(history), { EX: 60 }).catch(console.error);
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

  // Program Registration Methods (Parent registering child to program)
  public async registerChildToProgram(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as PickCreateProgramRegistration;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
      });

      if (!user || (user.role !== 'PARENT' && user.role !== 'POSYANDU')) {
        return c.json?.(
          {
            status: 403,
            message:
              'Hanya parent atau posyandu yang dapat mendaftarkan/menugaskan anak ke program',
          },
          403,
        );
      }

      if (!body.childId || !body.programId) {
        return c.json?.(
          {
            status: 400,
            message: 'childId dan programId harus diisi',
          },
          400,
        );
      }

      if (user.role === 'PARENT') {
        const registration = await programRegistrationService.createRegistration({
          parentId: jwtUser.id,
          childId: body.childId,
          programId: body.programId,
        });

        const posyandu = await prisma.posyandu.findUnique({
          where: { id: registration.posyanduId },
          select: { userID: true, name: true },
        });

        if (posyandu) {
          await NotificationService.notify({
            userId: posyandu.userID,
            type: NotifType.reminder,
            title: 'Pendaftaran Program Baru',
            message: `${registration.parent?.fullName} mendaftarkan anak "${registration.child?.fullName}" ke program "${registration.program?.name}". Mohon untuk dikonfirmasi.`,
          });
        }

        await this.redis.del([
          cacheKeys.programregistration.byParent(jwtUser.id),
          cacheKeys.programregistration.pending(registration.posyanduId),
          cacheKeys.programregistration.accepted(registration.posyanduId),
          cacheKeys.programregistration.byPosyandu(registration.posyanduId, null),
        ]);

        return c.json?.(
          {
            status: 201,
            message: 'Anak berhasil didaftarkan ke program',
            data: registration,
          },
          201,
        );
      } else if (user.role === 'POSYANDU') {
        return this.assignChildrenToProgramBulk(c, jwtUser);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes('sudah terdaftar')) {
        return c.json?.(
          {
            status: 409,
            message: error.message,
          },
          409,
        );
      }
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async getProgramRegistrations(c: AppContext) {
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
        return c.json?.({ status: 404, message: 'User not found' }, 404);
      }

      const rawStatus = new URL(c.request.url).searchParams.get('status');

      const status = rawStatus === 'pending' || rawStatus === 'accepted' ? rawStatus : undefined;
      let cacheKey = '';
      let data: any[] = [];

      if (user.role === 'PARENT') {
        cacheKey = cacheKeys.programregistration.byParent(user.id);

        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return c.json?.({ status: 200, message: 'success', data: JSON.parse(cached) }, 200);
        }

        data = await programRegistrationService.getProgramRegistrations({
          role: 'PARENT',
          parentId: user.id,
        });
      } else if (user.role === 'POSYANDU') {
        const posyandu = await prisma.posyandu.findFirst({
          where: { userID: user.id },
          select: { id: true },
        });

        if (!posyandu) {
          return c.json?.({ status: 404, message: 'Posyandu tidak ditemukan' }, 404);
        }

        cacheKey = cacheKeys.programregistration.byPosyandu(posyandu.id, status!);

        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return c.json?.({ status: 200, message: 'success', data: JSON.parse(cached) }, 200);
        }

        data = await programRegistrationService.getProgramRegistrations({
          role: 'POSYANDU',
          posyanduId: posyandu.id,
          status,
        });
      } else {
        return c.json?.({ status: 403, message: 'Role tidak diizinkan' }, 403);
      }

      await this.redis.set(cacheKey, JSON.stringify(data), { EX: 60 });

      return c.json?.(
        {
          status: 200,
          message: 'Berhasil mendapatkan registrasi program',
          data,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async acceptProgramRegistration(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as { id: string };

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
      });

      if (!user || user.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'Hanya posyandu yang dapat mengakses',
          },
          403,
        );
      }

      const posyandu = await prisma.posyandu.findFirst({
        where: {
          userID: jwtUser.id,
        },
      });

      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'Posyandu tidak ditemukan',
          },
          404,
        );
      }

      if (!body.id) {
        return c.json?.(
          {
            status: 400,
            message: 'id is required',
          },
          400,
        );
      }

      const registration = await programRegistrationService.acceptRegistration(
        body.id,
        posyandu.id,
      );

      await NotificationService.notify({
        userId: registration.parent?.id || '',
        type: NotifType.reminder,
        title: 'Program Diterima',
        message: `Program "${registration.program?.name}" untuk anak "${registration.child?.fullName}" telah diterima oleh ${posyandu.name}. Mohon konfirmasi terima program.`,
      });

      await this.redis.del([
        cacheKeys.programregistration.pending(posyandu.id),
        cacheKeys.programregistration.accepted(posyandu.id),
        cacheKeys.programregistration.byParent(registration.parentId),
      ]);

      return c.json?.(
        {
          status: 200,
          message: 'Registrasi program berhasil diterima',
          data: registration,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes('tidak ditemukan')) {
        return c.json?.(
          {
            status: 404,
            message: error.message,
          },
          404,
        );
      }
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async rejectProgramRegistration(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as { id: string };

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
      });

      if (!user || user.role !== 'POSYANDU') {
        return c.json?.(
          {
            status: 403,
            message: 'Hanya posyandu yang dapat mengakses',
          },
          403,
        );
      }

      const posyandu = await prisma.posyandu.findFirst({
        where: {
          userID: jwtUser.id,
        },
      });

      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'Posyandu tidak ditemukan',
          },
          404,
        );
      }

      if (!body.id) {
        return c.json?.(
          {
            status: 400,
            message: 'id is required',
          },
          400,
        );
      }

      const registration = await programRegistrationService.rejectRegistration(
        body.id,
        posyandu.id,
      );

      // Notify parent
      await NotificationService.notify({
        userId: registration.parent?.id || '',
        type: NotifType.reminder,
        title: 'Program Ditolak',
        message: `Program "${registration.program?.name}" untuk anak "${registration.child?.fullName}" telah ditolak oleh ${posyandu.name}. Silakan hubungi posyandu untuk informasi lebih lanjut.`,
      });

      // Invalidate related caches
      await this.redis.del([
        cacheKeys.programregistration.pending(posyandu.id),
        cacheKeys.programregistration.accepted(posyandu.id),
        cacheKeys.programregistration.byParent(registration.parentId),
      ]);

      return c.json?.(
        {
          status: 200,
          message: 'Registrasi program berhasil ditolak',
          data: registration,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes('tidak ditemukan')) {
        return c.json?.(
          {
            status: 404,
            message: error.message,
          },
          404,
        );
      }
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
}
export default new ProgresController();
