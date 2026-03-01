import type { Metadata } from "next";
import AboutSoftwareContainer from "./_container/about";

export const metadata: Metadata = {
  title: "Tentang NutriPlate — Platform Pemantauan Gizi & Tumbuh Kembang Anak",
  description:
    "Pelajari misi, visi, dan teknologi di balik NutriPlate: platform digital yang menghubungkan orang tua, kader posyandu, dan tenaga kesehatan untuk memantau gizi dan pertumbuhan balita.",
  keywords: [
    "NutriPlate",
    "tentang",
    "pemantauan gizi",
    "tumbuh kembang anak",
    "stunting",
    "posyandu",
    "IoT kesehatan",
  ],
  openGraph: {
    title: "Tentang NutriPlate — Platform Pemantauan Gizi Anak",
    description:
      "NutriPlate menggabungkan AI, IoT, dan standar WHO untuk memantau gizi dan pertumbuhan balita secara akurat.",
    type: "website",
  },
};

export default function AboutSoftware() {
  return <AboutSoftwareContainer />;
}
