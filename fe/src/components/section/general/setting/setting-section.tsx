import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface SettingSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const SettingSection: React.FC<SettingSectionProps> = ({ namespace }) => {
  return (
    <section className="w-full flex items-center flex-col justify-start min-h-screen overflow-x-hidden p-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Personalisasi & Bahasa</h1>
      </div>
      <div className="w-full">initial content</div>
    </section>
  );
};

export default SettingSection;
