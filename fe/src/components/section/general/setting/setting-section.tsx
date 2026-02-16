import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ThemeToggle from "@/core/components/theme-toggle";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SettingSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const SettingSection: React.FC<SettingSectionProps> = ({ namespace }) => {
  return (
    <section className="w-full flex items-center flex-col justify-start min-h-screen overflow-x-hidden p-2 space-y-2 ">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Personalisasi & Bahasa</h1>
      </div>

      <div className="w-full flex items-center justify-between border rounded-lg p-2">
        <div className="w-full flex items-center space-x-1">
          <Icon
            icon="tabler:sun"
            width="24"
            height="24"
            className={"text-primary"}
          />
          <h1 className="font-bold text-lg">Tampilan</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full flex items-center justify-between border rounded-lg p-2">
        <div className="w-full flex items-center space-x-1">
          <Icon
            icon="heroicons:language-16-solid"
            width="24"
            height="24"
            className="text-primary"
          />
          <h1 className="font-bold text-lg">Bahasa</h1>
        </div>
        {/* bahasa */}
      </div>
    </section>
  );
};

export default SettingSection;
