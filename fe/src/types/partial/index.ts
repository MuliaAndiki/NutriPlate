import { SidebarIconsKey } from "../icons";
import { KaderRegistrationDetailResponse } from "../res";

export enum GenderType {
  MALE,
  FEMALE,
}

export type RoleType = "PARENT" | "KADER" | "ADMIN" | "POSYANDU";

export const ROLES = ["PARENT", "POSYANDU", "KADER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export enum NotifType {
  result,
  reminder,
  alert,
  edukasi,
}

export type RegistrationStatus = "pending" | "accepted" | "rejected";
export type NotifTypeInterface = "reminder" | "result" | "alert" | "edukasi";

export type StatusRegisterionsKader =
  | "all"
  | "pending"
  | "accepted"
  | "rejected";
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

export const statusKaderRegisterMap: Record<StatusRegisterionsKader, string> = {
  all: "Semua",
  pending: "Menunggu",
  accepted: "Diterima",
  rejected: "Ditolak",
};

export const statusKaderRegisterStyle = (
  status: KaderRegistrationDetailResponse["status"],
) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};
