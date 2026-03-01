import RegisterContainer from "./_container/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
  description:
    "Daftar akun NutriPlate untuk mulai memantau gizi dan tumbuh kembang anak Anda.",
  robots: { index: false, follow: false },
};

export default async function Register() {
  return <RegisterContainer />;
}
