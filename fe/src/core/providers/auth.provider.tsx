"use client";

import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";

import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentToken = getCookie(APP_SESSION_COOKIE_KEY);
    const baseRole = getCookie("user_role");
    const isAuthPage =
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/register") ||
      pathname?.startsWith("/home") ||
      pathname.startsWith("/verify-otp") ||
      pathname?.startsWith("/forgot-password") ||
      pathname.startsWith("/verify-password") ||
      pathname.startsWith("/reset-password");

    const isAuthenticated = Boolean(currentToken);

    if (!isAuthenticated && !isAuthPage) {
      router.replace("/home");

      return;
    }

    if (isAuthenticated && isAuthPage) {
      switch (baseRole) {
        case "PARENT":
          router.replace("/parent/home");
          break;
        case "KADER":
          router.replace("/kader/home");
          break;
        case "POSYANDU":
          router.replace("/posyandu/home");
          break;
        case "ADMIN":
          router.replace("/admin/home");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
