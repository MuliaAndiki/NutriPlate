import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LaporanPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const LaporanPosyanduSection: React.FC<LaporanPosyanduSectionProps> = ({
  namespace,
}) => {
  return (
    <section className="flex w-full min-h-screen flex-col items-center p-2 justify-start overflow-x-hidden space-y-2">
      <div className="w-full flex items-center ">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-lg font-bold">Laporan Posyandu</h1>
      </div>
    </section>
  );
};

export default LaporanPosyanduSection;
