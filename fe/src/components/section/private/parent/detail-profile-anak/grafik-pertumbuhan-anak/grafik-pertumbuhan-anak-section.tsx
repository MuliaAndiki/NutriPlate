import GrowthStatusCard from "@/components/card/growth-status";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import ChartGrowthWeight from "@/components/chart/ChartGrowthWeight";
import ChartGrowthHeight from "@/components/chart/ChartGrowthHeight";
import { GrowthStatusType } from "@/types/card";
import MeasurementTable from "@/components/table/measurement-tabel";
import GrowthStatusCardFallBack from "@/components/fallback/growthStatusCard-fallback";

interface GrafikPertumbuhanAnakSection {
  router: AppRouterInstance;
  heightChartData: any[];
  weightChartData: any[];
  summary: any;

  historyMeasument: GrowthStatusType[];
}

const GrafikPertumbuhanAnakHeroSection: React.FC<
  GrafikPertumbuhanAnakSection
> = ({
  router,
  heightChartData,
  weightChartData,
  summary,
  historyMeasument,
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col space-y-2 p-2">
      <div className="w-full justify-start items-center flex">
        <ChevronLeft onClick={() => router.back()} className="scale-120" />
        <h1 className="text-2xl font-bold">Grafik Pertumbuhan Anak</h1>
      </div>

      {historyMeasument.length > 0 ? (
        <GrowthStatusCard
          data={historyMeasument[historyMeasument.length - 1]}
        />
      ) : (
        <GrowthStatusCardFallBack />
      )}

      <div className="w-full rounded-lg border">
        <ChartGrowthWeight chartData={weightChartData} summary={summary} />
      </div>

      <div className="w-full rounded-lg border">
        <ChartGrowthHeight chartData={heightChartData} summary={summary} />
      </div>
      <div className="w-full rounded-lg border">
        <MeasurementTable historyMeasument={historyMeasument ?? []} />
      </div>
    </div>
  );
};

export default GrafikPertumbuhanAnakHeroSection;
