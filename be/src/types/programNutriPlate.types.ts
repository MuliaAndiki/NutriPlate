export interface IProgramNutriPlate {
  id: string;
  posyanduId: string;
  name: string;
  description: string;
  startPrograms: Date;
  activity: string[];
  benefit: string[];
  durationRegister: Date;
  endPrograms: Date;
  createdAt: Date;
}

export type PickCreateProgram = Pick<
  IProgramNutriPlate,
  | 'name'
  | 'description'
  | 'startPrograms'
  | 'activity'
  | 'benefit'
  | 'durationRegister'
  | 'endPrograms'
>;
export type PickProgramID = Pick<IProgramNutriPlate, 'id'>;
