import LandingContainer from "./_containers/lading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selamat Datang",
  description:
    "NutriPlate - Platform pemantauan gizi anak berbasis IoT. Deteksi makanan otomatis, evaluasi pertumbuhan WHO, dan program nutrisi terintegrasi.",
  openGraph: {
    title: "NutriPlate - Platform Pemantauan Gizi Anak",
    description:
      "Deteksi makanan otomatis, evaluasi pertumbuhan WHO, dan program nutrisi terintegrasi.",
  },
};

export default function LandingPage() {
  return <LandingContainer />;
}
