import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarDefaultData } from "@/configs/app.config";
import { kebabCaseToWords } from "@/utils/string.format";

import SidebarSection from "../partial/sidebar-section";

interface AppSidebarProps {
  isCollapsed: any;
  pathname: string;
}

export function AppSidebar({ isCollapsed, pathname }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4 h-20 flex justify-center">
        {isCollapsed ? (
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        ) : (
          <div className="flex gap-2 items-center">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-semibold">
              {kebabCaseToWords(pathname)}
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>NutriPlate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarSection
              MenuData={SidebarDefaultData}
              isCollapsed={isCollapsed}
              pathname={pathname}
              // initial setup
              switchRole=""
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
