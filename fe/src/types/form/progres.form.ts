import { INutritionProgramProgress } from "../schema/progres.schema";
export type FormAssingPrograms = Pick<
  INutritionProgramProgress,
  "childId" | "programId" | "dayNumber"
>;
export type ParamsProgramProgresID = Pick<INutritionProgramProgress, "id">;
export type FormCancelPrograms = Pick<INutritionProgramProgress, "childId">;
