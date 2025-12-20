export interface IProgramNutriPlate {
  id: string;
  posyanduId: string;
  name: string;
  description: string;
  durationDays: number;
  createdAt: Date;
}

export type PickCreateProgram = Pick<IProgramNutriPlate, 'name' | 'description' | 'durationDays'>;
export type PickProgramID = Pick<IProgramNutriPlate, 'id'>;
