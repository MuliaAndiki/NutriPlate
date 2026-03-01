import ContainerHome from "./_containers/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "NutriPlate - Sistem Integratif Berbasis IoT & PWA untuk Pemantauan Gizi Anak. Pantau tumbuh kembang anak Anda secara real-time.",
  openGraph: {
    title: "NutriPlate - Pemantauan Gizi Anak",
    description:
      "Sistem Integratif Berbasis IoT & PWA untuk Pemantauan Gizi Anak di Dusun Lambateung",
  },
};

export default async function Home() {
  return <ContainerHome />;
}
