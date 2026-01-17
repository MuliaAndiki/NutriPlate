import { IProgress } from "../schema/progres.schema";
export type FormAssingPrograms = Pick<
  IProgress,
  "childId" | "programId" | "dayNumber"
>;
export type ParamsProgramProgresID = Pick<IProgress, "id">;
export type FormCancelPrograms = Pick<IProgress, "childId">;
