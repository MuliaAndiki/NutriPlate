"use client";
import { useParams } from "next/navigation";

import DetailGiziHeroSection from "@/components/section/private/parent/asupan-gizi/detail-gizi/detail-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useDebugLog } from "@/utils/useDebug";

const DetailGiziContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();
  // foodIntake
  const foodIntakeByIdQuery =
    service.foodIntake.query.getHistoryFoodIntakeById(id);
  const foodIntakeByIdData = foodIntakeByIdQuery.data?.data ?? null;

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailGiziHeroSection
          namespace={{
            router: nameSpace.router,
          }}
          service={{
            query: {
              food: foodIntakeByIdData ?? null,
              isLoading: foodIntakeByIdQuery.isLoading,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailGiziContainer;
