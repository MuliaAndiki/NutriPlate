import { RegistrationStatus } from "../partial";
export interface IProgramRegistration {
  id: string;
  parentId: string;
  childId: string;
  programId: string;
  posyanduId: string;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}
