export interface INutritionProgramProgress {
  id: string;
  childId?: string;
  programId: string;
  isCompleted: boolean;
  createdAt: string;
  isAccep: boolean;
}

export interface INutritionProgramProgressWithRelations extends INutritionProgramProgress {
  child?: any;
  program?: any;
  subtask?: any[];
}
