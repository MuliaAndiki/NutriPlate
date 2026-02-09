"use client";
import LaporanSection from "@/components/section/private/kader/laporan/laporan-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const LaporanContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //measurement
  const measurementChildAllQuery = service.measuremnt.query.allMeasurement(
    selector.posyanduId!,
  );
  const measurementChildAllData = measurementChildAllQuery.data?.data ?? [];

  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <LaporanSection
          service={{
            query: {
              isLoading: measurementChildAllQuery.isLoading,
              measurement: measurementChildAllData ?? [],
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default LaporanContainer;
