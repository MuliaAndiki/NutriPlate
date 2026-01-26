import { NutritionStatus } from "../partial";

export interface ProfileChildType {
  key: string;
  label: string;
  unit?: string;
  header: string;
  icon: string;
  color: string;
  text: string;
  border: string;
  source: string;
  // Not Fix
  getValue: (profile: any) => number | string | null;
}

export interface GrowthStatusType {
  id: string;
  childId: string;
  measurementDate: string;
  weightKg: string;
  heightCm: string;
  headCircumferenceCm?: string;
  nutritionStatus: NutritionStatus;
  note?: string;
  createdAt: string;
}
