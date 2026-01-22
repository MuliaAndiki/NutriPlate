import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickCreateKaderRegistration } from '@/types/kaderRegistration.types';
import kaderRegistrationService from '@/service/kaderRegistration.service';
import prisma from 'prisma/client';

class KaderController {
  public async registerToposyandu(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as PickCreateKaderRegistration;

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

      if (!user || user.role !== 'KADER') {
        return c.json?.(
          {
            status: 403,
            message: 'Hanya kader yang dapat mendaftar',
          },
          403,
        );
      }

      if (!body.posyanduId) {
        return c.json?.(
          {
            status: 400,
            message: 'posyanduId is required',
          },
          400,
        );
      }

      const posyandu = await prisma.posyandu.findFirst({
        where: {
          id: body.posyanduId,
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

      const registration = await kaderRegistrationService.createRegistration({
        kaderId: jwtUser.id,
        posyanduId: body.posyanduId,
      });

      return c.json?.(
        {
          status: 201,
          message: 'Registrasi berhasil',
          data: registration,
        },
        201,
      );
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

  public async getMyRegistrations(c: AppContext) {
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
      });

      if (!user || user.role !== 'KADER') {
        return c.json?.(
          {
            status: 403,
            message: 'Hanya kader yang dapat mengakses',
          },
          403,
        );
      }

      const registrations = await kaderRegistrationService.getKaderRegistrations(jwtUser.id);

      return c.json?.(
        {
          status: 200,
          message: 'Berhasil mendapatkan registrasi',
          data: registrations,
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

  public async getPendingRegistrations(c: AppContext) {
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

      const registrations = await kaderRegistrationService.getPendingRegistrations(posyandu.id);

      return c.json?.(
        {
          status: 200,
          message: 'Berhasil mendapatkan registrasi pending',
          data: registrations,
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

  public async getAcceptedRegistrations(c: AppContext) {
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

      const registrations = await kaderRegistrationService.getAcceptedRegistrations(posyandu.id);

      return c.json?.(
        {
          status: 200,
          message: 'Berhasil mendapatkan registrasi accepted',
          data: registrations,
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

  public async acceptRegistration(c: AppContext) {
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

      const registration = await kaderRegistrationService.acceptRegistration(body.id, posyandu.id);

      return c.json?.(
        {
          status: 200,
          message: 'Registrasi berhasil diterima',
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

  public async rejectRegistration(c: AppContext) {
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

      const registration = await kaderRegistrationService.rejectRegistration(body.id, posyandu.id);

      return c.json?.(
        {
          status: 200,
          message: 'Registrasi berhasil ditolak',
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

export default new KaderController();
