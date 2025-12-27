"use client";
import RiwayatAsupanGiziHeroSection from "@/components/section/private/parent/riwayat-asupan-gizi/riwayat-asupan-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

import { HistoryFoodData } from "@/configs/component.config";
const RiwayatAsupanGiziContainer = () => {
  const nameSpace = useAppNameSpace();

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <RiwayatAsupanGiziHeroSection
          router={nameSpace.router}
          historyFoodData={HistoryFoodData ?? []}
        />
      </main>
    </SidebarLayout>
  );
};

export default RiwayatAsupanGiziContainer;
