"use client";

import LaporanPosyanduSection from "@/components/section/private/posyandu/laporan/laporan-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const LaporanPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  const measurementQuery = service.measuremnt.query.allMeasurement(
    selector.posyanduId!,
  );
  const measurementData = measurementQuery.data?.data ?? [];
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <LaporanPosyanduSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              isLoading: measurementQuery.isLoading,
              measurement: measurementData ?? [],
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default LaporanPosyanduContainer;
