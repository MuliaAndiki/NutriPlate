import LoginContainer from "./_container/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun NutriPlate Anda untuk memantau gizi anak.",
  robots: { index: false, follow: false },
};

export default async function Login() {
  return <LoginContainer />;
}
