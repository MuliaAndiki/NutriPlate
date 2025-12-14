import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

export const SidebarIconDefault = {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} as const;
export type SidebarIconsKey = keyof typeof SidebarIconDefault;
