import { Icon } from "@iconify/react";

import { HistoryFoodType, ProfileChildType } from "@/types/card";
import { RouteDetailChildType } from "@/types/components";
export const HistoryFoodData: HistoryFoodType[] = [
  {
    id: "1",
    date: "12/08/2025 - 14:01 WIB",
    title: "Nasi + Sayur + Ayam",
    gizi: 90,
    weight: 120,
    image: "/images/dummyFood.png",
  },
  {
    id: "2",
    date: "12/08/2025 - 14:01 WIB",
    title: "Nasi + Sayur + Ayam",
    gizi: 90,
    weight: 120,
    image: "/images/dummyFood.png",
  },
  {
    id: "3",
    date: "12/08/2025 - 14:01 WIB",
    title: "Nasi + Sayur + Ayam",
    gizi: 90,
    weight: 120,
    image: "/images/dummyFood.png",
  },
  {
    id: "4",
    date: "12/08/2025 - 14:01 WIB",
    title: "Nasi + Sayur + Ayam",
    gizi: 90,
    weight: 120,
    image: "/images/dummyFood.png",
  },
];

export const profileChildCardsConfig: ProfileChildType[] = [
  {
    key: "baselineWeightKg",
    label: "Berat Badan",
    unit: "kg",
    header: "bg-[#BED4F9]",
    icon: "ion:scale-outline",
    color: "bg-[#E3EBF8]",
    text: "[#E3EBF8]",
    border: `border-[#BED4F9]`,
    getValue: (p) => p.baselineWeightKg,
  },
  {
    key: "baselineHeightCm",
    label: "Tinggi Badan",
    unit: "cm",
    header: "bg-[#F3E4B2]",
    icon: "solar:ruler-outline",
    color: "bg-[#F6F1DF]",
    text: "[#E3EBF8]",
    border: "border-[#F3E4B2]",
    getValue: (p) => p.baselineHeightCm,
  },
  {
    key: "baselineBmi",
    label: "BMI",
    icon: "mingcute:soup-pot-line",
    header: "bg-[#B2E3DB]",
    color: "bg-[#DFF0ED]",
    text: "[#E3EBF8]",
    border: "border-[#B2E3DB]",
    getValue: (p) => p.baselineBmi,
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
