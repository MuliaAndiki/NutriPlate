import Link from "next/link";

import { SidebarGroupContent } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarContentType } from "@/types/partial";
import { cn } from "@/utils/classname";
import { SidebarIconDefault } from "@/types/icons";

interface SidebarSectionProps {
  MenuData: any;
  pathname: any;
  isCollapsed: any;
  switchRole: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  MenuData,
  isCollapsed,
  pathname,
  switchRole,
}) => {
  const RenderSidebar = () => {
    return MenuData?.map((item: SidebarContentType) => {
      const Icon = SidebarIconDefault[item.icon];
      const isActive = pathname === item.url;
      switch (switchRole) {
        case "PARENT":
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={isCollapsed ? item.title : undefined}
              >
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 h-10",
                    isActive &&
                      "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  )}
                >
                  {Icon && <Icon className="h-6 w-6 lg:h-10 lg:w-10" />}

                  <span className="text-base lg:text-lg">
                    {!isCollapsed && item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
      }
    });
  };
  return (
    <SidebarGroupContent className="flex h-full flex-col justify-between">
      <SidebarMenu className="w-full ">{RenderSidebar()}</SidebarMenu>
    </SidebarGroupContent>
  );
};

export default SidebarSection;
