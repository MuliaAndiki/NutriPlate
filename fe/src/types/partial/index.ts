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
  baselineWeightKg?: number | undefined;
  baselineHeightCm?: number | undefined;
  baselineBmi?: number | undefined;
  baselineZscore?: number | undefined;
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
