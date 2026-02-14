"use client";

import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { useRouter } from "next/navigation";

export default function NotSupportedPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 w-full px-4">
      <h1 className="text-2xl font-bold text-center">📱 Mobile Only</h1>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        NutriPlate hanya tersedia untuk perangkat mobile.
        <br />
        <br />
        Silakan buka menggunakan:
        <br />
        ✓ Smartphone / Tablet
        <br />✓ Chrome DevTools mobile mode (F12)
      </p>
      <ButtonWrapper onClick={() => router.push("/home")}>Reload</ButtonWrapper>
    </div>
  );
}
