export interface INutritionProgramProgress {
  id: string;
  childId: string;
  programId: string;
  isAccep: boolean;

  isCompleted: boolean;
  createdAt: string;
}

export type PickAssingPrograms = Pick<INutritionProgramProgress, 'childId' | 'programId'>;
export type PickProgramProgresID = Pick<INutritionProgramProgress, 'id'>;
export type PickCancelPrograms = Pick<INutritionProgramProgress, 'childId'>;
