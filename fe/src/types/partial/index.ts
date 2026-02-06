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

export const nutritionConfig: Record<
  NutritionStatus,
  {
    label: string;
    border: string;
    badge: string;
    index: string;
  }
> = {
  normal: {
    label: "Normal",
    border: "border-emerald-400",
    badge: "bg-emerald-400 text-white",
    index: "bg-emerald-400 text-white",
  },
  underweight: {
    label: "Berisiko",
    border: "border-yellow-400",
    badge: "bg-yellow-400 text-white",
    index: "bg-yellow-400 text-white",
  },
  severely_underweight: {
    label: "Gizi Buruk",
    border: "border-red-500",
    badge: "bg-red-500 text-white",
    index: "bg-red-500 text-white",
  },
  overweight: {
    label: "Berat Berlebih",
    border: "border-blue-400",
    badge: "bg-blue-400 text-white",
    index: "bg-blue-400 text-white",
  },
};

export const nutritionFilterMap: {
  label: string;
  value: NutritionStatus | "Semua";
}[] = [
  { label: "Semua", value: "Semua" },
  { label: "Normal", value: "normal" },
  { label: "Berisiko", value: "underweight" },
  { label: "Gizi Buruk", value: "severely_underweight" },
];
