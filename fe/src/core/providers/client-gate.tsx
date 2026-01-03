"use client";
import { useEffect } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { getCookie } from "cookies-next";

export function ClientGate({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { router } = useAppNameSpace();
  const baseRole = getCookie("user_role");

  const getBaseRedirectPath = () => {
    switch (baseRole) {
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
