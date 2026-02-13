import { IProgram } from "../schema/program.schema";

export type FormCreateProgram = Pick<
  IProgram,
  | "name"
  | "description"
  | "durationRegister"
  | "activity"
  | "benefit"
  | "endPrograms"
>;

export type FormUpdateProgram = Pick<
  IProgram,
  "id" | "name" | "description" | "activity" | "benefit" | "startPrograms"
>;
