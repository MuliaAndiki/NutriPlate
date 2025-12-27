import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Button } from "@/components/ui/button";
import {
  NavigationAdmin,
  NavigationKader,
  NavigationParent,
  NavigationPosyandu,
} from "@/configs/footer.config";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
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

  return (
    <main className="w-full h-full ">
      <div className={`flex justify-between items-center bg-background  p-2  `}>
        {mapping.map((items) => {
          const active = pathname === items.href;

          return (
            <Button
              key={items.name}
              variant="ghost"
              className="p-3"
              onClick={() => router.push(items.href)}
              disabled={active}
            >
              <div
                className={`flex flex-col items-center p-1 ${
                  active
                    ? "text-primary border-t-2 border-primary"
                    : "text-muted-foreground"
                }`}
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
