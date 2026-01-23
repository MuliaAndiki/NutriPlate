import prisma from 'prisma/client';
import { PickCreateKaderRegistration } from '@/types/kaderRegistration.types';

class KaderRegistrationService {
  public async createRegistration(data: PickCreateKaderRegistration) {
    try {
      const registration = await prisma.kaderRegistration.create({
        data: {
          kaderId: data.kaderId,
          posyanduId: data.posyanduId,
        },
        include: {
          kader: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          posyandu: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return registration;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint failed')) {
        throw new Error('Kader sudah terdaftar di posyandu ini');
      }
      throw error;
    }
  }

  public async getPendingRegistrations(posyanduId: string) {
    try {
      const registrations = await prisma.kaderRegistration.findMany({
        where: {
          posyanduId,
          status: 'pending',
        },
        include: {
          kader: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              avaUrl: true,
            },
          },
          posyandu: {
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

      return registrations;
    } catch (error) {
      throw error;
    }
  }

  public async getAcceptedRegistrations(posyanduId: string) {
    try {
      const registrations = await prisma.kaderRegistration.findMany({
        where: {
          posyanduId,
          status: 'accepted',
        },
        include: {
          kader: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              avaUrl: true,
            },
          },
          posyandu: {
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

      return registrations;
    } catch (error) {
      throw error;
    }
  }

  public async acceptRegistration(registrationId: string, posyanduId: string) {
    try {
      const registration = await prisma.kaderRegistration.findFirst({
        where: {
          id: registrationId,
          posyanduId,
        },
      });

      if (!registration) {
        throw new Error('Registrasi tidak ditemukan');
      }

      const updated = await prisma.kaderRegistration.update({
        where: {
          id: registrationId,
        },
        data: {
          status: 'accepted',
        },
        include: {
          kader: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          posyandu: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  public async rejectRegistration(registrationId: string, posyanduId: string) {
    try {
      const registration = await prisma.kaderRegistration.findFirst({
        where: {
          id: registrationId,
          posyanduId,
        },
      });

      if (!registration) {
        throw new Error('Registrasi tidak ditemukan');
      }

      const updated = await prisma.kaderRegistration.update({
        where: {
          id: registrationId,
        },
        data: {
          status: 'rejected',
        },
        include: {
          kader: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          posyandu: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  public async getKaderRegistrations(kaderId: string) {
    try {
      const registrations = await prisma.kaderRegistration.findMany({
        where: {
          kaderId,
        },
        include: {
          posyandu: {
            select: {
              id: true,
              name: true,
              district: true,
              subDistrict: true,
              village: true,
              email: true,
              phone: true,
              avaUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return registrations;
    } catch (error) {
      throw error;
    }
  }
}

export default new KaderRegistrationService();
