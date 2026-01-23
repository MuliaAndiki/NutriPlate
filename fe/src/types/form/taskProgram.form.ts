import { ITaskProgram } from "@/types/schema/taskProgram.schema";

export type FormCreateTask = Pick<
  ITaskProgram,
  "progresId" | "title" | "description"
>;

export type FormUpdateTask = Pick<
  ITaskProgram,
  "id" | "title" | "description" | "isComplated"
>;

export type FormCompleteTask = Pick<ITaskProgram, "id">;
