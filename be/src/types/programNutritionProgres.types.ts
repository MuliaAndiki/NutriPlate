export interface INutritionProgramProgress {
  id: string;
  childId: string;
  programId: string;
  dayNumber: number;
  isCompleted: boolean;
  createdAt: string;
}

export type PickAssingPrograms = Pick<
  INutritionProgramProgress,
  'childId' | 'programId' | 'dayNumber'
>;
export type PickProgramProgresID = Pick<INutritionProgramProgress, 'id'>;
export type PickCancelPrograms = Pick<INutritionProgramProgress, 'childId'>;
