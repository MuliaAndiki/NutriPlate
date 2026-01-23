import { INutritionProgramProgress } from "@/types/schema/nutritionProgramProgress.schema";

export type FormCreateProgramProgress = Pick<
  INutritionProgramProgress,
  "childId" | "programId"
>;

export type FormUpdateProgramProgress = Pick<
  INutritionProgramProgress,
  "id" | "isCompleted" | "isAccep"
>;

export type FormCompleteProgramProgress = Pick<INutritionProgramProgress, "id">;
