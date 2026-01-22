import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface NotifikasiDetailSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const NotifikasiDetailSection: React.FC<NotifikasiDetailSectionProps> = ({
  namespace,
}) => {
  return (
    <section className="w-full min-h-screen flex justify-start items-center flex-col p-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Notifikasi</h1>
      </div>
    </section>
  );
};

export default NotifikasiDetailSection;
