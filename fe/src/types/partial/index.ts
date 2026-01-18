import { SidebarIconsKey } from "../icons";

export enum GenderType {
  MALE,
  FEMALE,
}

export type RoleType = "PARENT" | "KADER" | "ADMIN" | "POSYANDU";

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

export enum StuntingStatus {
  SEVERELY_STUNTED = "SEVERELY_STUNTED",
  STUNTED = "STUNTED",
  NORMAL = "NORMAL",
  TALL = "TALL",
}

export enum StuntingSeverity {
  SEVERE = "SEVERE",
  MODERATE = "MODERATE",
  MILD = "MILD",
  NORMAL = "NORMAL",
}

export type WhoRiskLevel = "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "NORMAL";

export interface SidebarContentType {
  title: string;
  url: string;
  icon: SidebarIconsKey;
}

export interface ProfileChild {
  birthWeightKg?: number;
  birthHeightCm?: number;
  pregnancyAgeWeeks?: number;
  allergicFoods?: string[];
  chronicConditions?: string[];
  feedingType?: string;
  activityLevel?: string;
}

export interface ChildPartial {
  child: {
    id: string;
    fullName: string;
  };
}
