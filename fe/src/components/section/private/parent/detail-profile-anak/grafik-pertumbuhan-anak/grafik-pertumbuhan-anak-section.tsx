import GrowthStatusCard from "@/components/card/growth-status";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ChartGrowthWeight from "@/components/chart/ChartGrowthWeight";
import ChartGrowthHeight from "@/components/chart/ChartGrowthHeight";
import { GrowthStatusType } from "@/types/card";
import MeasurementTable from "@/components/table/measurement-tabel";
import GrowthStatusCardFallBack from "@/components/fallback/growthStatusCard-fallback";
import ChartGrowthFallBack from "@/components/fallback/ChartGrowthWeight-fallback";
import { Icon } from "@iconify/react/dist/iconify.js";

interface GrafikPertumbuhanAnakSection {
  namespace: {
    router: AppRouterInstance;
  };
  servive: {
    query: {
      heightChartData: any[];
      weightChartData: any[];
      summary: any;
      historyMeasument: GrowthStatusType[];
    };
  };
  state: {
    title: any;
  };
}

const GrafikPertumbuhanAnakHeroSection: React.FC<
  GrafikPertumbuhanAnakSection
> = ({ namespace, servive, state }) => {
  return (
    <div className="w-full min-h-screen flex flex-col space-y-2 p-2">
      <div className="w-full justify-start items-center flex">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Grafik Pertumbuhan Anak</h1>
      </div>

      {servive.query.historyMeasument.length > 0 ? (
        <GrowthStatusCard
          data={
            servive.query.historyMeasument[
              servive.query.historyMeasument.length - 1
            ]
          }
        />
      ) : (
        <GrowthStatusCardFallBack />
      )}

      {servive.query.weightChartData.length > 0 ? (
        <div className="w-full rounded-lg border">
          <ChartGrowthWeight
            chartData={servive.query.weightChartData}
            summary={servive.query.summary}
          />
        </div>
      ) : (
        <ChartGrowthFallBack title={state.title.weight} />
      )}

      {servive.query.heightChartData.length > 0 ? (
        <div className="w-full rounded-lg border">
          <ChartGrowthHeight
            chartData={servive.query.heightChartData}
            summary={servive.query.summary}
          />
        </div>
      ) : (
        <ChartGrowthFallBack title={state.title.height} />
      )}

      <div className="w-full rounded-lg border">
        <MeasurementTable
          historyMeasument={servive.query.historyMeasument ?? []}
        />
      </div>
      {servive ? (
        <div className="w-full bg-destructive/50 p-2 border rounded-lg flex items-center justify-center ">
          <Icon
            icon="solar:danger-circle-outline"
            width="14"
            height="14"
            className="text-destructive"
          />
          <h1 className="text-destructive flex items-center justify-center">
            Menunggu data pengukuran posyandu
          </h1>
        </div>
      ) : null}
    </div>
  );
};

export default GrafikPertumbuhanAnakHeroSection;
