import { RegistrationStatus } from '@prisma/client';

export interface PickCreateProgramRegistration {
  childId: string;
  programId: string;
}

export interface PickProgramRegistrationID {
  id: string;
}

export interface ProgramRegistrationResponse {
  id: string;
  parentId: string;
  childId: string;
  programId: string;
  posyanduId: string;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramRegistrationWithRelations extends ProgramRegistrationResponse {
  parent?: {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
  };
  child?: {
    id: string;
    fullName: string;
  };
  program?: {
    id: string;
    name: string;
    description?: string;
    startPrograms?: Date;
    endPrograms?: Date;
  };
  posyandu?: {
    id: string;
    name: string;
  };
}
