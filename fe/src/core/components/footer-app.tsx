import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationAdmin,
  NavigationKader,
  NavigationParent,
  NavigationPosyandu,
} from "@/configs/footer.config";

interface FooterAppProps {
  router: AppRouterInstance;
  isActive: string;
  setIsActive: React.Dispatch<React.SetStateAction<string>>;
  baseRole: string;
}
const FooterApp: React.FC<FooterAppProps> = ({
  router,
  isActive,
  setIsActive,
  baseRole,
}) => {
  const navigationRole = () => {
    switch (baseRole) {
      case "PARENT":
        return NavigationParent;
      case "KADER":
        return NavigationKader;
      case "POSYANDU":
        return NavigationPosyandu;
      case "ADMIN":
        return NavigationAdmin;
      default:
        return [];
    }
  };
  const mapping = navigationRole();

  const handleRedirect = (name: typeof isActive) => {
    setIsActive(name);
    const base = navigationRole();
    const item = base.find((item) => item.name === name);
    if (!item) return;

    router.push(item.href);
  };

  return (
    <main className="w-full h-full ">
      <div className={`flex justify-between items-center bg-background  p-2  `}>
        {mapping.map((items) => {
          const active = isActive === items.name;
          return (
            <Button
              key={items.name}
              variant="ghost"
              className={`p-3`}
              onClick={() => handleRedirect(items.name)}
              disabled={active}
            >
              <div
                className={`flex justify-center items-center h-auto w-auto flex-col scale-120 text-foreground  p-1  ${active ? "text-primary border-t-2 sha border-primary inset-shadow-primary" : "text-background"}`}
              >
                {items.icon}
                <p className={`text-xs ${active ? "font-bold" : "font-light"}`}>
                  {items.name}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </main>
  );
};

export default FooterApp;
