import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

export const SidebarIconDefault = {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} as const;
export type SidebarIconsKey = keyof typeof SidebarIconDefault;

export interface notifikasiIconMap {
  title: string;
  icon: string;
  color: string;
}

export const NotifiIcon: Record<string, { icon: string; className: string }> = {
  reminder: {
    icon: "fluent:warning-20-filled",
    className: "text-warning border-warning",
  },
  result: {
    icon: "solar:chart-bold",
    className: "text-primary border-primary",
  },
  edukasi: {
    icon: "mdi:book-open-page-variant",
    className: "text-destructive border-destructive",
  },
  alert: {
    icon: "fe:notice-active",
    className: "text-success border-success",
  },
};

export const DefaultNotifIcon = {
  icon: "mdi:bell-outline",
  className: "",
};
