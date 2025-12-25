"use client";

import { getCookie } from "cookies-next";
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

    if (!isAuthenticated && !isAuthPage) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isAuthPage) {
      // setUp
      // router.replace('/home');
      return;
    }
  }, [pathname, currentUser, router]);

  return <>{children}</>;
}
