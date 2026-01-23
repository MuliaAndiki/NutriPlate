import { IProgramRegistration } from "../schema/programRegistration.schema";

export type FormRegisterChildToProgram = Pick<
  IProgramRegistration,
  "childId" | "programId"
>;

export type FormAcceptProgramRegistration = Pick<IProgramRegistration, "id">;

export type FormRejectProgramRegistration = Pick<IProgramRegistration, "id">;
