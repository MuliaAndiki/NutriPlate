"use client";
import { useEffect } from "react";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { getCookie } from "cookies-next";
import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";

export function ClientGate({ children }: { children: React.ReactNode }) {
  const { router } = useAppNameSpace();
  const currentToken = getCookie(APP_SESSION_COOKIE_KEY);
  const baseRole = getCookie("user_role");

  useEffect(() => {
    if (!currentToken) {
      router.replace("/login");
    }
  }, [currentToken, router]);

  return <>{children}</>;
}
