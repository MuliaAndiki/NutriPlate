"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navigationMenuConfig } from "@/configs/app.config";
import useService from "@/hooks/mutation/prop.service";
import { cn } from "@/lib/classname";

// import UserDropdown from './user.dropdown';
import LanguageDropdown from "./language.dropdown";
import NotificationDropdown from "./notification.dropdown";
import ThemeToggle from "./theme-toggle";

export default function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const service = useService();
  const logout = service.auth.mutation.logout();

  const handleLogout = () => {
    return logout.mutate({});
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm p-6 border-b transition-all duration-200",
        isScrolled ? "border-b-border shadow-md" : "border-b-transparent"
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {navigationMenuConfig?.items?.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {/* Klo Lengket DIsini */}
          <Button
            onClick={() => {
              handleLogout();
            }}
          >
            reset
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageDropdown />
          <NotificationDropdown />
          {/* <UserDropdown /> */}
        </div>
      </div>
    </nav>
  );
}
