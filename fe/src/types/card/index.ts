import { NutritionStatus } from "../partial";
import { IChild } from "../schema/child.schema";
export interface HistoryFoodType {
  id: string;
  image: string;
  date: string;
  title: string;
  weight: number;
  gizi: number;
}

export type ChildCardType = Pick<
  IChild,
  | "avaChild"
  | "dateOfBirth"
  | "fullName"
  | "gender"
  | "parentId"
  | "placeOfBirth"
  | "id"
  | "profileChild"
  | "updatedAt"
>;

export interface ProfileChildType {
  key: string;
  label: string;
  unit?: string;
  header: string;
  icon: string;
  color: string;
  text: string;
  border: string;
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
