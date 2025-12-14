"use client";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1>Only mobile version supported 🚫📱</h1>
      </div>
    );
  }
  return <>{children}</>;
}
