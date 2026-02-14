export interface ITaskProgram {
  id: string;
  progresId: string;
  title: string;
  description: string;
  isComplated: boolean;
  createdAt: string;
  mealType: string;
  targetEnergyKcal: number;
  targetProteinGram: number;
  targetFatGram: number;
  targetCarbGram: number;
  targetFiberGram: number;
  updatedAt: string;
  isBroadcast: boolean;
}
