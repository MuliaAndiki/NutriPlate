export interface INutritionProgramProgress {
  id: string;
  childId: string;
  programId: string;
  dayNumber: number;
  isAccep: boolean;
  isCompleted: boolean;
  createdAt: string;
}
