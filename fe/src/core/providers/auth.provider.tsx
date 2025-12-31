"use client";

import { deleteCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";

import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";
import { useAppDispatch } from "@/hooks/dispatch/dispatch";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import { setCurrentUser } from "@/stores/authSlice/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const baseRole = useAppSelector((state) => state.auth.currentUser?.user.role);

  useEffect(() => {
    if (!currentUser?.user?.token) {
      const token = getCookie(APP_SESSION_COOKIE_KEY);
      if (token) {
        dispatch(setCurrentUser({ user: { token } } as any));
      }
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    const isAuthPage =
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/register") ||
      pathname?.startsWith("/home") ||
      pathname.startsWith("/verify-otp") ||
      pathname?.startsWith("/forgot-password") ||
      pathname.startsWith("/verify-password") ||
      pathname.startsWith("/reset-password");

    const isAuthenticated = Boolean(currentUser?.user?.token);

    if (!isAuthenticated && !isAuthPage && !baseRole) {
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
  }, [pathname, currentUser, router]);

  return <>{children}</>;
}
