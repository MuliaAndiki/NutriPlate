import { Icon } from "@iconify/react/dist/iconify.js";
import { MeasurementRespone } from "@/types/res";
import { NutritionStatus, nutritionConfig } from "@/types/partial";
import NutritionStatusPie from "@/components/chart/nutrition-status-pie";
import RekapPenimbanganTable from "@/components/table/rekap-penimbangan-table";
import EmptyCard from "@/components/fallback/empty-card";
import SectionSkeleton from "@/components/skeleton/section-skeleton";
import StatusSummarySwiper from "@/components/card/summary/status-summary-swiper";

// not fix
interface LaporanSectionProps {
  service: {
    query: {
      isLoading: boolean;
      measurement: MeasurementRespone[];
    };
  };
}

const LaporanSection: React.FC<LaporanSectionProps> = ({ service }) => {
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
    <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laporan Posyandu</h1>
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
      <div className="w-full grid grid-cols-2 gap-2 items-center">
        {latestMeasurements.length === 0 ? (
          <EmptyCard message="Belum ada data status gizi" />
        ) : (
          <>
            <NutritionStatusPie data={statusData} />
            <div className="w-full space-y-2">
              {statusData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColorMap[item.status] }}
                    />
                    <h1 className="text-xs font-semibold">
                      {nutritionConfig[item.status].label}
                    </h1>
                  </div>
                  <h1 className="text-xs text-muted-foreground">
                    {Math.round((item.count / totalStatus) * 100)}% ={" "}
                    {item.count} balita
                  </h1>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="w-full flex items-center ">
        <Icon
          icon="material-symbols:history-rounded"
          width="24"
          height="24"
          className="text-primary"
        />
        <h1 className="text-base font-bold">Rekap Penimbangan</h1>
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

export default LaporanSection;
