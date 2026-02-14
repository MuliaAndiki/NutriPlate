"use client";
import DaftarBalitaKaderSection from "@/components/section/private/kader/daftar-balita/daftar-balita-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { NutritionStatus } from "@/types/partial";
import { useState } from "react";

const DaftarBalitaKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //measurement Child
  const measurementChildAllQuery = service.measuremnt.query.allMeasurement(
    selector.posyanduId!,
  );
  const measurementChildAllData = measurementChildAllQuery.data?.data ?? [];

  //state
  const [filter, setFilter] = useState<NutritionStatus | "Semua">("Semua");
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <DaftarBalitaKaderSection
          service={{
            query: {
              isLoading: measurementChildAllQuery.isLoading,
              children: measurementChildAllData ?? [],
            },
          }}
          state={{
            filter: filter,
            setFilter: setFilter,
            search: {
              value: searchValue,
              onChange: setSearchValue,
            },
          }}
          namespace={{
            router: namespace.router,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarBalitaKaderContainer;
