import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Icon } from "@iconify/react/dist/iconify.js";
import { MeasurementRespone } from "@/types/res";
import { NutritionStatus, nutritionConfig } from "@/types/partial";
import NutritionStatusPie from "@/components/chart/nutrition-status-pie";
import RekapPenimbanganTable from "@/components/table/rekap-penimbangan-table";
import EmptyCard from "@/components/fallback/empty-card";
import SectionSkeleton from "@/components/skeleton/section-skeleton";
import StatusSummarySwiper from "@/components/card/summary/status-summary-swiper";

interface LaporanPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      isLoading: boolean;
      measurement: MeasurementRespone[];
    };
  };
}
const LaporanPosyanduSection: React.FC<LaporanPosyanduSectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <SectionSkeleton />;
  }

  const measurement = service.query.measurement ?? [];

  const latestByChild = new Map<string, MeasurementRespone>();
  for (const item of measurement) {
    const current = latestByChild.get(item.childId);
    const currentDate = current
      ? new Date(current.measurementDate ?? current.createdAt).getTime()
      : 0;
    const nextDate = new Date(item.measurementDate ?? item.createdAt).getTime();
    if (!current || nextDate > currentDate) {
      latestByChild.set(item.childId, item);
    }
  }
  const latestMeasurements = Array.from(latestByChild.values()).sort((a, b) => {
    const ad = new Date(a.measurementDate ?? a.createdAt).getTime();
    const bd = new Date(b.measurementDate ?? b.createdAt).getTime();
    return bd - ad;
  });

  const totalBalita = latestMeasurements.length;
  const totalBerisiko = latestMeasurements.filter(
    (item) => item.nutritionStatus !== "normal",
  ).length;

  const statusCounts: Record<NutritionStatus, number> = {
    normal: 0,
    underweight: 0,
    severely_underweight: 0,
    overweight: 0,
  };
  latestMeasurements.forEach((item) => {
    statusCounts[item.nutritionStatus] += 1;
  });
  const statusData = (Object.keys(statusCounts) as NutritionStatus[]).map(
    (key) => ({
      status: key,
      count: statusCounts[key],
    }),
  );
  const totalStatus = latestMeasurements.length || 1;
  const statusColorMap: Record<NutritionStatus, string> = {
    normal: "var(--chart-3)",
    underweight: "var(--chart-4)",
    severely_underweight: "var(--chart-5)",
    overweight: "var(--chart-2)",
  };
  const summaryItems = [
    {
      key: "total",
      title: "Total Balita",
      value: totalBalita,
      unit: "balita",
      icon: "mdi:account-child-outline",
      tone: "secondary" as const,
    },
    {
      key: "risk",
      title: "Balita Berisiko",
      value: totalBerisiko,
      unit: "balita",
      icon: "mdi:alert-circle-outline",
      tone: "warning" as const,
    },
  ];
  return (
    <section className="flex w-full min-h-screen flex-col items-center p-2 justify-start overflow-x-hidden space-y-2">
      <div className="w-full flex items-center ">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-lg font-bold">Laporan Posyandu</h1>
      </div>
      <div className="w-full">
        <h1 className="text-sm font-light">
          Rekap data balita dan penimbangan
        </h1>
      </div>

      <div className="w-full">
        {latestMeasurements.length === 0 ? (
          <EmptyCard message="Belum ada data ringkasan" />
        ) : (
          <StatusSummarySwiper items={summaryItems} />
        )}
      </div>

      <div className="w-full flex items-center space-x-1">
        <Icon
          icon="tabler:chart-pie"
          width="24"
          height="24"
          className="text-primary"
        />
        <h1 className="text-base font-bold">Distribusi Status Gizi</h1>
      </div>
      <div className="w-full flex items-center">
        {latestMeasurements.length === 0 ? (
          <EmptyCard message="Belum ada data status gizi" />
        ) : (
          <div className="w-full grid  grid-cols-2  border rounded-lg border-primary p-2">
            <NutritionStatusPie data={statusData} />
            <div className="w-full flex justify-center flex-col items-start space-y-2">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center flex-col">
                  <div className="w-full flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColorMap[item.status] }}
                    />
                    <h1 className="text-xs font-semibold">
                      {nutritionConfig[item.status].label}
                    </h1>
                  </div>
                  <div className="flex items-center flex-col space-x-2"></div>
                  <h1 className="text-xs text-muted-foreground">
                    {Math.round((item.count / totalStatus) * 100)}% ={" "}
                    {item.count} balita
                  </h1>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Icon
            icon="material-symbols:history-rounded"
            width="24"
            height="24"
            className="text-primary"
          />
          <h1 className="text-base font-bold">Rekap Penimbangan</h1>
        </div>
      </div>
      <div className="w-full">
        {latestMeasurements.length === 0 ? (
          <EmptyCard message="Belum ada data penimbangan" />
        ) : (
          <RekapPenimbanganTable data={latestMeasurements} />
        )}
      </div>
    </section>
  );
};

export default LaporanPosyanduSection;
