"use client";

import DailySummarySection from "@/components/section/private/parent/profile-anak/detail-profile-anak/daily-summary/daily-summary-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DailySummaryContainer = () => {
  const namespace = useAppNameSpace();
  const { id } = useParams<{ id: string }>();
  //service
  const service = useService();
  //child
  const childQueryByID = service.user.query.childById(id);
  const childDataByID = childQueryByID.data?.data ?? null;
  //food summary
  const foodSummaryDailyQuery = service.foodSummary.query.foodSummaryDaily(id);
  const foodSummaryDailyData = foodSummaryDailyQuery.data?.data ?? null;
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DailySummarySection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              ChildCard: childDataByID,
              foodSummaryDaily: foodSummaryDailyData,
              isLoading:
                childQueryByID.isLoading || foodSummaryDailyQuery.isLoading,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DailySummaryContainer;
