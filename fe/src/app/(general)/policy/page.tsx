import type { Metadata } from "next";
import PolicyContainer from "./_container/policy";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — NutriPlate",
  description:
    "Pelajari bagaimana NutriPlate mengumpulkan, menggunakan, dan melindungi data kesehatan anak Anda, termasuk data IoT dan catatan gizi.",
  keywords: [
    "kebijakan privasi",
    "NutriPlate",
    "data kesehatan anak",
    "perlindungan data",
    "IoT",
    "gizi",
  ],
  openGraph: {
    title: "Kebijakan Privasi — NutriPlate",
    description:
      "Cara NutriPlate melindungi data kesehatan dan gizi anak Anda.",
    type: "website",
  },
};

export default function Policy() {
  return <PolicyContainer />;
}
