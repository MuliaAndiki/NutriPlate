import GrowthStatusCard from "@/components/card/growth-status";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { type ChartConfig } from "@/components/ui/chart";
import ChartVsWHO from "@/components/chart/chart-who";
import { Icon } from "@iconify/react/dist/iconify.js";

interface GrafikPertumbuhanAnakSection {
  router: AppRouterInstance;
}

const GrafikPertumbuhanAnakHeroSection: React.FC<
  GrafikPertumbuhanAnakSection
> = ({ router }) => {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-3)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const labels = [
    {
      color: "bg-primary",
      label: "Data Anak",
    },
    {
      color: "bg-[#2979FF]",
      label: "Standar WHO",
    },
  ];
  const title = "Grafik Berat Badan vs Usia";
  return (
    <div className="w-full min-h-screen flex flex-col space-y-2 p-2">
      <div className="w-full justify-start items-center flex">
        <ChevronLeft onClick={() => router.back()} className="scale-120" />
        <h1 className="text-2xl font-bold">Grafik Pertumbuhan Anak</h1>
      </div>
      <div className="w-full">
        <GrowthStatusCard />
      </div>
      <div className="w-full  rounded-lg border flex flex-col  ">
        <ChartVsWHO
          chartConfig={chartConfig}
          chartData={chartData}
          labels={labels}
          title={title}
        />
      </div>
    </div>
  );
};

export default GrafikPertumbuhanAnakHeroSection;
