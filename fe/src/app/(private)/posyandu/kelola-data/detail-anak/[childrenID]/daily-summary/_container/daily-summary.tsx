"use client";

import DailySummaryKaderSection from "@/components/section/private/kader/daftar-balita/detail-anak/daily-summary/daily-summary-section";

import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
import { useState } from "react";

const DailySummaryPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const { childrenID } = useParams<{ childrenID: string }>();
  const service = useService();
  const [selectDay, setSelectDay] = useState<number>(0);

  // child
  const childQueryByID = service.user.query.childById(childrenID);
  const childDataByID = childQueryByID.data?.data ?? null;

  //food
  const foodSummaryDailyQuery =
    service.foodSummary.query.foodSummaryDaily(childrenID);
  const foodSummaryDailyData = foodSummaryDailyQuery.data?.data ?? null;

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - selectDay);
  const startDateStr = startDate.toISOString().split("T")[0];

  const foodSummaryRangeQuery = service.foodSummary.query.foodSummaryRange(
    childrenID,
    {
      startDate: startDateStr,
      endDate: endDate,
    },
  );
  const foodSummaryRangeData = foodSummaryRangeQuery.data?.data ?? null;

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DailySummaryKaderSection
          namespace={{ router: namespace.router }}
          service={{
            query: {
              ChildCard: childDataByID,
              foodSummaryDaily: foodSummaryDailyData,
              isLoading:
                childQueryByID.isLoading ||
                foodSummaryDailyQuery.isLoading ||
                foodSummaryRangeQuery.isLoading,
              foodSummaryRange: foodSummaryRangeData ?? null,
            },
          }}
          state={{
            setSelectDay: setSelectDay,
            selectDay: selectDay,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DailySummaryPosyanduContainer;
