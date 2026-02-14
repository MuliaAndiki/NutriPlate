import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ComingSoon from "@/components/card/comingsoon/comingsoon";
import ThemeToggle from "@/core/components/theme-toggle";
interface SettingSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const SettingSection: React.FC<SettingSectionProps> = ({ namespace }) => {
  return (
    <section className="w-full flex items-center flex-col justify-start min-h-screen overflow-x-hidden ">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Pengaturan</h1>
      </div>
      <ThemeToggle />
    </section>
  );
};

export default SettingSection;
