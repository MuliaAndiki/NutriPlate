import { IProgress } from "../schema/progres.schema";

export type FormAssignProgram = Pick<IProgress, "childId" | "programId">;

export type FormUpdateProgres = Pick<
  IProgress,
  "id" | "isCompleted" | "isAccep"
>;

export type FormCancelProgram = Pick<IProgress, "id"> & {
  childId: string;
};
