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
