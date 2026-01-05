import GrowthStatusCard from "@/components/card/growth-status";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import ChartGrowthWeight from "@/components/chart/ChartGrowthWeight";
import ChartGrowthHeight from "@/components/chart/ChartGrowthHeight";

interface GrafikPertumbuhanAnakSection {
  router: AppRouterInstance;
  heightChartData: any[];
  weightChartData: any[];
  summary: any;
}

const GrafikPertumbuhanAnakHeroSection: React.FC<
  GrafikPertumbuhanAnakSection
> = ({ router, heightChartData, weightChartData, summary }) => {
  return (
    <div className="w-full min-h-screen flex flex-col space-y-2 p-2">
      <div className="w-full justify-start items-center flex">
        <ChevronLeft onClick={() => router.back()} className="scale-120" />
        <h1 className="text-2xl font-bold">Grafik Pertumbuhan Anak</h1>
      </div>

      <div className="w-full">
        <GrowthStatusCard />
      </div>

      <div className="w-full rounded-lg border">
        <ChartGrowthWeight chartData={weightChartData} summary={summary} />
      </div>

      <div className="w-full rounded-lg border">
        <ChartGrowthHeight chartData={heightChartData} summary={summary} />
      </div>
    </div>
  );
};

export default GrafikPertumbuhanAnakHeroSection;
