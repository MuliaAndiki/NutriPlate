export interface INutritionProgramProgress {
  id: string;
  childId: string;
  programId: string;
  dayNumber: number;
  isCompleted: boolean;
  createdAt: string;
}
