import type { Metadata } from "next";
import TermsContainer from "./_container/terms";

export const metadata: Metadata = {
  title: "Ketentuan Layanan — NutriPlate",
  description:
    "Ketentuan penggunaan platform NutriPlate: tanggung jawab pengguna, akurasi data, batasan layanan kesehatan, perangkat IoT, dan ketersediaan layanan.",
  keywords: [
    "ketentuan layanan",
    "NutriPlate",
    "syarat penggunaan",
    "tanggung jawab",
    "disclamer kesehatan",
    "IoT",
  ],
  openGraph: {
    title: "Ketentuan Layanan — NutriPlate",
    description:
      "Syarat dan ketentuan penggunaan platform pemantauan gizi NutriPlate.",
    type: "website",
  },
};

export default function Terms() {
  return <TermsContainer />;
}
