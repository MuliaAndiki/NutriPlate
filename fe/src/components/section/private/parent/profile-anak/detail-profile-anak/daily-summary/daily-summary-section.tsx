import CapaianKebutuhan from "@/components/card/growth/macro-daily";
import StatusAsupan from "@/components/card/growth/status-asupan";
import { ChildRespone } from "@/types/res/child.respone";
import { DailySummaryResponse } from "@/types/res/foodSummary.respone";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DailySummarySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      ChildCard: ChildRespone;
      foodSummaryDaily: DailySummaryResponse;
      isLoading: boolean;
    };
  };
}

const DailySummarySection: React.FC<DailySummarySectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }

  return (
    <section className="w-full flex items-center justify-start min-h-screen flex-col space-y-5">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Asupan Hari Ini</h1>
      </div>
      <div className="w-full">
        <StatusAsupan
          id={service.query.ChildCard.id}
          data={service.query.foodSummaryDaily}
        />
      </div>
      <div className="w-full flex items-center ">
        <Icon
          icon="tdesign:rice-filled"
          width="34"
          height="34"
          className="text-primary"
        />
        <h1 className="text-2xl font-bold">Capaian Kebutuhan</h1>
      </div>
      <div className="w-full">
        <CapaianKebutuhan data={service.query.foodSummaryDaily} />
      </div>
    </section>
  );
};

export default DailySummarySection;
