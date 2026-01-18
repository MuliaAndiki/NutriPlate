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
