"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/core/components/app-sidebar";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import FooterApp from "../components/footer-app";
import { getCookie } from "cookies-next";
import { UserRole } from "@/configs/app.config";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: AppLayoutProps) {
  const nameSpace = useAppNameSpace();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const currentRole = getCookie("user_role") as UserRole | undefined;
  const [isActive, setIsActive] = useState<string>("");

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar isCollapsed={isCollapsed} pathname={pathname} />

        <SidebarInset>
          <div className="flex flex-col min-h-screen w-full">
            <div className="flex-1 overflow-auto w-full">
              <div className="container max-w-7xl mx-auto  pb-20">
                {children}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full  z-20">
              <FooterApp
                isActive={isActive}
                setIsActive={setIsActive}
                router={nameSpace.router}
                baseRole={currentRole!}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
