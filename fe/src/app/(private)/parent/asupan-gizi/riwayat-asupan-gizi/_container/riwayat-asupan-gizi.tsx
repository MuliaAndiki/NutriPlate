"use client";
import RiwayatAsupanGiziHeroSection from "@/components/section/private/parent/asupan-gizi/riwayat-asupan-gizi/riwayat-asupan-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import useService from "@/hooks/mutation/prop.service";
const RiwayatAsupanGiziContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const foodHistoryQuery = service.foodIntake.query.getHistoryFoodIntake();
  const foodHistoryData = foodHistoryQuery.data?.data ?? [];

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <RiwayatAsupanGiziHeroSection
          service={{
            query: {
              history: foodHistoryData ?? [],
              isLoading: foodHistoryQuery.isLoading,
            },
          }}
          namespace={{
            router: nameSpace.router,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default RiwayatAsupanGiziContainer;
