"use client";
import { useEffect } from "react";

import { useAppSelector } from "@/hooks/dispatch/dispatch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

export function ClientGate({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { router } = useAppNameSpace();
  const current = useAppSelector((state) => state.auth.currentUser);

  const getBaseRedirectPath = () => {
    if (!current) return "/login";

    switch (current.user.role) {
      case "PARENT":
        return "/parent/home";
      case "KADER":
        return "/kader/home";
      case "POSYANDU":
        return "/posyandu/home";
      case "ADMIN":
        return "/admin/home";
      default:
        return "/home";
    }
  };

  useEffect(() => {
    const check = () => {
      const target = getBaseRedirectPath();
      if (!isMobile) {
        router.replace(target);
      }
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [router]);

  return <>{children}</>;
}
