import { ProfileChildType } from "@/types/card";
import { RouteDetailChildType } from "@/types/components";
import { notifikasiIconMap } from "@/types/icons";
import { RegistrationStatus } from "@/types/partial";

export const profileChildCardsConfig: ProfileChildType[] = [
  {
    key: "weightKg",
    label: "Berat Badan",
    unit: "kg",
    source: "measurement",
    header: "bg-[#BED4F9]",
    icon: "ion:scale-outline",
    color: "bg-[#E3EBF8]",
    text: "text-[#1E3A8A]",
    border: "border-[#BED4F9]",
    getValue: (p) => p?.weightKg,
  },
  {
    key: "heightCm",
    label: "Tinggi Badan",
    unit: "cm",
    source: "measurement",
    header: "bg-[#F3E4B2]",
    icon: "solar:ruler-outline",
    color: "bg-[#F6F1DF]",
    text: "text-[#92400E]",
    border: "border-[#F3E4B2]",
    getValue: (p) => p?.heightCm,
  },
  {
    key: "nutritionStatus",
    label: "Status Gizi",
    source: "measurement",
    header: "bg-[#B2E3DB]",
    icon: "mingcute:soup-pot-line",
    color: "bg-[#DFF0ED]",
    text: "text-[#065F46]",
    border: "border-[#B2E3DB]",
    getValue: (p) => p?.nutritionStatus,
  },
];

export const RouteDetailChild: RouteDetailChildType[] = [
  {
    icon: "ph:baby",
    title: "Data Anak",
    icon2: "mingcute:arrow-right-fill",
    href: "/parent/profile-anak/detail",
    slice: "/data-anak",
  },

  {
    icon: "streamline-flex:health-care-2-remix",
    title: "Profil Kesehatan Anak",
    icon2: "mingcute:arrow-right-fill",
    href: "/parent/profile-anak/detail",
    slice: "/profile-kesehatan-anak",
  },
  {
    icon: "fluent:arrow-growth-24-filled",
    title: "Grafik Pertumbuhan Anak",
    icon2: "mingcute:arrow-right-fill",
    href: "/parent/profile-anak/detail",
    slice: "/grafik-pertumbuhan-anak",
  },
];

export const NotifikasiIcons: notifikasiIconMap[] = [
  {
    title: "Pengingat",
    icon: "fe:notice-active",
    color: "text-warning border-warning",
  },
  {
    title: "Hasil",
    icon: "solar:chart-bold",
    color: "text-primary border-primary",
  },
  {
    title: "Peringatan",
    icon: "fluent:warning-20-filled",
    color: "text-destructive border-destructive",
  },
  {
    title: "Edukasi",
    icon: "mdi:book-open-page-variant",
    color: "text-success border-success",
  },
];

export const StatusConfig: Record<
  RegistrationStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  accepted: {
    label: "Diterima",
    color: "bg-green-100 text-green-700 border-green-300",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-100 text-red-700 border-red-300",
  },
};
