import { ITaskProgram } from "@/types/schema/taskProgram.schema";

export type FormCreateTask = Pick<
  ITaskProgram,
  | "title"
  | "description"
  | "mealType"
  | "targetEnergyKcal"
  | "targetProteinGram"
  | "targetFatGram"
  | "targetCarbGram"
  | "targetFiberGram"
>;

export type FormUpdateTask = Pick<
  ITaskProgram,
  "id" | "title" | "description" | "isComplated"
>;

export type FormCompleteTask = Pick<ITaskProgram, "id">;
