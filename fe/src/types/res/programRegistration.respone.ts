import { PosyanduRespone } from "./posyandu.respone";
import { ChildPartial } from "./child.respone";

export interface ParentDetailResponse {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
}

export interface ProgramDetailResponse {
  id: string;
  name: string;
  description?: string;
  startPrograms?: Date;
  endPrograms?: Date;
}

export interface ProgramRegistrationDetailResponse {
  id: string;
  parentId: string;
  childId: string;
  programId: string;
  posyanduId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  parent?: ParentDetailResponse;
  child?: ChildPartial;
  program?: ProgramDetailResponse;
  posyandu?: PosyanduRespone;
}

export interface RegisterChildToProgramResponse {
  status: number;
  message: string;
  data: ProgramRegistrationDetailResponse;
}

export interface GetMyProgramRegistrationsResponse {
  status: number;
  message: string;
  data: ProgramRegistrationDetailResponse[];
}

export interface GetPendingProgramRegistrationsResponse {
  status: number;
  message: string;
  data: ProgramRegistrationDetailResponse[];
}

export interface GetAcceptedProgramRegistrationsResponse {
  status: number;
  message: string;
  data: ProgramRegistrationDetailResponse[];
}

export interface AcceptProgramRegistrationResponse {
  status: number;
  message: string;
  data: ProgramRegistrationDetailResponse;
}

export interface RejectProgramRegistrationResponse {
  status: number;
  message: string;
  data: ProgramRegistrationDetailResponse;
}
