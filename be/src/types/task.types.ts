export interface ITask {
  id: string;
  progressId: string;
  title: string;
  isBroadcast: boolean;
  description: string;
  isComplated: boolean;
  mealType?: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';
  targetEnergyKcal?: number;
  targetProteinGram?: number;
  targetFatGram?: number;
  targetCarbGram?: number;
  targetFiberGram?: number;
}

export type PickCreateTask = Pick<
  ITask,
  | 'title'
  | 'description'
  | 'isComplated'
  | 'isBroadcast'
  | 'mealType'
  | 'targetEnergyKcal'
  | 'targetProteinGram'
  | 'targetFatGram'
  | 'targetCarbGram'
  | 'targetFiberGram'
>;
export type PickTaskProgresID = Pick<ITask, 'progressId'>;
export type PickTaskID = Pick<ITask, 'id'>;
