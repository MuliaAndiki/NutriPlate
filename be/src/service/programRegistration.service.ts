import prisma from 'prisma/client';
import { PickCreateProgramRegistration } from '@/types/programRegistration.types';

class ProgramRegistrationService {
  async createRegistration(data: PickCreateProgramRegistration & { parentId: string }) {
    // Check if program exists
    const program = await prisma.nutriplateProgram.findUnique({
      where: { id: data.programId },
      select: { id: true, posyanduId: true },
    });

    if (!program) {
      throw new Error('Program tidak ditemukan');
    }

    const child = await prisma.child.findFirst({
      where: {
        id: data.childId,
        parentId: data.parentId,
      },
      select: { id: true, posyanduId: true },
    });

    if (!child) {
      throw new Error('Anak tidak ditemukan atau bukan milik parent');
    }

    if (child.posyanduId !== program.posyanduId) {
      throw new Error('Anak tidak terdaftar di posyandu tempat program berada');
    }

    const existingRegistration = await prisma.programRegistration.findFirst({
      where: {
        parentId: data.parentId,
        childId: data.childId,
        programId: data.programId,
      },
    });

    if (existingRegistration) {
      throw new Error('Anak sudah terdaftar ke program ini');
    }

    const registration = await prisma.programRegistration.create({
      data: {
        parentId: data.parentId,
        childId: data.childId,
        programId: data.programId,
        posyanduId: program.posyanduId,
      },
      include: {
        parent: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
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
            description: true,
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

    return registration;
  }

  async getProgramRegistrations(params: {
    role: 'PARENT' | 'POSYANDU';
    parentId?: string;
    posyanduId?: string;
    status?: 'pending' | 'accepted';
  }) {
    const { role, parentId, posyanduId, status } = params;

    return prisma.programRegistration.findMany({
      where: {
        ...(role === 'PARENT' && {
          parentId,
        }),
        ...(role === 'POSYANDU' && {
          posyanduId,
          ...(status && { status }),
        }),
      },
      include: {
        parent:
          role === 'POSYANDU'
            ? {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                },
              }
            : false,
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
            description: role === 'PARENT',
            startPrograms: role === 'PARENT',
            endPrograms: role === 'PARENT',
          },
        },
        posyandu:
          role === 'PARENT'
            ? {
                select: {
                  id: true,
                  name: true,
                },
              }
            : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async acceptRegistration(registrationId: string, posyanduId: string) {
    const registration = await prisma.programRegistration.findFirst({
      where: {
        id: registrationId,
        posyanduId,
      },
    });

    if (!registration) {
      throw new Error('Registrasi program tidak ditemukan');
    }

    await prisma.nutritionProgramProgress.create({
      data: {
        childId: registration.childId,
        programId: registration.programId,
        isAccep: true,
      },
    });

    const updated = await prisma.programRegistration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: 'accepted',
      },
      include: {
        parent: {
          select: {
            id: true,
            fullName: true,
          },
        },
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
    });

    return updated;
  }

  async rejectRegistration(registrationId: string, posyanduId: string) {
    const registration = await prisma.programRegistration.findFirst({
      where: {
        id: registrationId,
        posyanduId,
      },
    });

    if (!registration) {
      throw new Error('Registrasi program tidak ditemukan');
    }

    const updated = await prisma.programRegistration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: 'rejected',
      },
      include: {
        parent: {
          select: {
            id: true,
            fullName: true,
          },
        },
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
    });

    return updated;
  }
}

export default new ProgramRegistrationService();
