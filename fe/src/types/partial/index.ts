import { SidebarIconsKey } from "../icons";
export enum GenderType {
  MALE,
  FEMALE,
}
export enum RoleType {
  PARENT,
  KADER,
  POSYANDU,
  ADMIN,
}

export interface ProfileChild {
  birthWeightKg?: number;
  birthHeightCm?: number;
  pregnancyAgeWeeks?: number;
  allergicFoods?: string[];
  chronicConditions?: string[];
  feedingType?: string;
  activityLevel?: string;
  baselineWeightKg?: number;
  baselineHeightCm?: number;
  baselineBmi?: number;
  baselineZscore?: number;
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
