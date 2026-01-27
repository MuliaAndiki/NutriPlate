"use client";
import { useEffect } from "react";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { getCookie } from "cookies-next";
import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";

/**
 * ClientGate: Hanya untuk auth check & token validation
 * Mobile check sudah di handle di proxy.ts (server middleware)
 * Jangan redirect ke /home karena server middleware sudah filter non-mobile
 */
export function ClientGate({ children }: { children: React.ReactNode }) {
  const { router } = useAppNameSpace();
  const currentToken = getCookie(APP_SESSION_COOKIE_KEY);
  const baseRole = getCookie("user_role");

  /**
   * Only redirect ke login jika token expired
   * Jangan redirect ke home page - biar user stay di current page setelah reload
   */
  useEffect(() => {
    if (!currentToken) {
      // Token tidak ada, redirect ke login
      router.replace("/login");
    }
  }, [currentToken, router]);

  return <>{children}</>;
}
