export interface IProgram {
  id: string;
  posyanduId: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
  durationRegister?: string;
  startPrograms?: string;
  endPrograms?: string;
  activity: string[];
  benefit: string[];
}

export interface IProgramWithRelations extends IProgram {
  posyandu?: any;
  user?: any;
  progress?: any[];
  registrations?: any[];
}
