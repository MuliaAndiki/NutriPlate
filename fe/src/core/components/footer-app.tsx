import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";

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
const FooterApp: React.FC<FooterAppProps> = ({ router, baseRole }) => {
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
    <main className="w-full h-full  ">
      <div className="flex items-center justify-around bg-background h-14">
        {mapping.map((items) => {
          const active = pathname === items.href;

          return (
            <Button
              key={items.name}
              variant="ghost"
              className="flex-1 h-full p-0"
              onClick={() => router.push(items.href)}
              disabled={active}
            >
              <div
                className={`flex flex-col items-center justify-center w-full h-full ${
                  active
                    ? "text-primary border-t-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {items.icon}
                <p className="text-[10px] leading-none mt-0.5">{items.name}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </main>
  );
};

export default FooterApp;
