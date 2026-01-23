import { NutritionStatus } from '@prisma/client';

export interface IMeasurements {
  id: string;
  childID: string;
  measurementDate: string;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm: number;
  nutritionStatus: NutritionStatus;
  note: string;
}

export type PickCreateMeasurements = Pick<
  IMeasurements,
  'headCircumferenceCm' | 'heightCm' | 'measurementDate' | 'note' | 'nutritionStatus' | 'weightKg'
>;

export type PickMeasurementsChildID = Pick<IMeasurements, 'childID'> & { id?: string };
