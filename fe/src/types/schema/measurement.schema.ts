import { NutritionStatus } from "../partial";

export interface IMeasurement {
  id: string;
  childId: string;
  measurementDate: Date;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm: number;
  nutritionStatus: NutritionStatus;
  note: string;
  createdAt: Date;
}
