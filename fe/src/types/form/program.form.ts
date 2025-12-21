import { IProgramNutriPlate } from "../schema/program.schema";
export type FormCreateProgram = Pick<
  IProgramNutriPlate,
  "name" | "description" | "durationDays"
>;
