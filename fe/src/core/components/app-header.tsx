"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navigationMenuConfig } from "@/configs/app.config";
import { cn } from "@/lib/classname";
import LanguageDropdown from "./language.dropdown";
import ThemeToggle from "./theme-toggle";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";

export default function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm p-6 border-b transition-all duration-200 ",
        isScrolled ? "border-b-border shadow-md" : "border-b-transparent",
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="absolute w-600 h-150 rounded-full bg-primary/20 blur-3xl z-[-1] left-0 -translate-x-50 -translate-y-60" />
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-1">
            <Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
            <h1 className="text-lg font-bold">NutriPlate</h1>
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex">
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

        <div className="hidden md:flex items-center gap-4">
          <ButtonWrapper className="w-full">Download Applikasi</ButtonWrapper>
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-md border border-border bg-background/60"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} className="w-6 h-6" />
        </button>
      </div>

      {isOpen ? (
        <div className="md:hidden mt-4 rounded-xl border border-border bg-background/90 backdrop-blur-sm p-4">
          <div className="flex flex-col gap-3">
            {navigationMenuConfig?.items?.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-sm font-medium text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <ButtonWrapper className="w-full">Download Applikasi</ButtonWrapper>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
