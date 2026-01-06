import { SidebarIconsKey } from "../icons";
export enum GenderType {
  MALE,
  FEMALE,
}
export type RoleType = "PARENT" | "KADER" | "ADMIN" | "POSYANDU";

export interface ProfileChild {
  birthWeightKg?: number | undefined;
  birthHeightCm?: number | undefined;
  pregnancyAgeWeeks?: number | undefined;
  allergicFoods?: string[];
  chronicConditions?: string[];
  feedingType?: string;
  activityLevel?: string;
}

export interface SidebarContentType {
  title: string;
  url: string;
  icon: SidebarIconsKey;
}

export enum NotifType {
  result,
  reminder,
  alert,
  edukasi,
}

export type NutritionStatus =
  | "severely_underweight"
  | "underweight"
  | "normal"
  | "overweight";
