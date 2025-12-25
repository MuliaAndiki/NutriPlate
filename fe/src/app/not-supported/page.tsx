"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAppSelector } from "@/hooks/dispatch/dispatch";

const MOBILE_BREAKPOINT = 768;

export default function NotSupportedPage() {
  const router = useRouter();
  const current = useAppSelector((state) => state.auth.currentUser);
  const baseRole = current?.user.role;
  const getBaseRedirectPath = () => {
    // Mata Dini
    if (!current) return "/login";

    switch (baseRole) {
      case "PARENT":
        return "/parent/home";
      case "KADER":
        return "/kader/home";
      case "POSYANDU":
        return "/posyandu/home";
      default:
        return "/home";
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        const target = getBaseRedirectPath();
        router.replace(target);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 w-full">
      <h1 className="text-xl font-semibold">
        Only mobile device supported 🚫💻
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Silakan buka menggunakan perangkat mobile
        <br />
        atau kecilkan layar browser
      </p>
    </div>
  );
}
