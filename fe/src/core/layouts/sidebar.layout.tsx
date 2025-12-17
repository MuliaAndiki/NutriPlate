"use client";

import { usePathname } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/core/components/app-sidebar";

import LanguageDropdown from "../components/language.dropdown";
import NotificationDropdown from "../components/notification.dropdown";
import ThemeToggle from "../components/theme-toggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar isCollapsed={isCollapsed} pathname={pathname} />
        <SidebarInset>
          <div className="flex h-full flex-col w-full">
            <div className="flex p-4 items-center gap-2 border-b w-full h-20">
              <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                <SidebarTrigger />
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <LanguageDropdown />
                  <NotificationDropdown />
                  {/* <UserDropdown /> */}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto w-full">
              <div className="container h-full max-w-7xl w-full mx-auto p-1">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
