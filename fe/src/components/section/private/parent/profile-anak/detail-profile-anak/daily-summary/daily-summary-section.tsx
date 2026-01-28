import CapaianKebutuhan from "@/components/card/growth/macro-daily";
import StatusAsupan from "@/components/card/growth/status-asupan";
import { ChildRespone } from "@/types/res/child.respone";
import { DailySummaryResponse } from "@/types/res/foodSummary.respone";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { aggregateRangeSummary } from "@/utils/summary";
import MacroRangeChart from "@/components/card/growth/macroRange";

interface DailySummarySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      ChildCard: ChildRespone;
      foodSummaryDaily: DailySummaryResponse;
      isLoading: boolean;
      foodSummaryRange: any;
    };
  };
}

const DailySummarySection: React.FC<DailySummarySectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) return <div>loading..</div>;

  return (
    <section className="w-full flex min-h-screen flex-col space-y-5 p-2">
      <div className="w-full flex items-center gap-2">
        <ChevronLeft onClick={() => namespace.router.back()} />
        <h1 className="text-2xl font-bold">Asupan Hari Ini</h1>
      </div>

      <StatusAsupan
        id={service.query.ChildCard.id}
        data={service.query.foodSummaryDaily}
      />

      <div className="flex items-center gap-2">
        <Icon icon="tdesign:rice-filled" width="34" className="text-primary" />
        <h2 className="text-xl font-bold">Capaian Kebutuhan</h2>
      </div>

      <CapaianKebutuhan
        data={service.query.foodSummaryDaily}
        key={service.query.foodSummaryDaily.childId}
      />

      <MacroRangeChart summaries={service.query.foodSummaryRange.summaries} />
    </section>
  );
};
export default DailySummarySection;
