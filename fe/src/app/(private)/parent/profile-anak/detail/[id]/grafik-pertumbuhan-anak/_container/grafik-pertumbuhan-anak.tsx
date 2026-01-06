"use client";

import GrafikPertumbuhanAnakHeroSection from "@/components/section/private/parent/detail-profile-anak/grafik-pertumbuhan-anak/grafik-pertumbuhan-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const GrafikPertumbuhanAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const { id } = useParams<{ id: string }>();
  const service = useService();

  const growthChartQuery = service.measuremnt.query.growthChart(id);
  const measurementQuery = service.measuremnt.query.measurement(id);
  const growthChartData = growthChartQuery.data?.data ?? null;
  const measurementData = measurementQuery.data?.data ?? [];
  useEffect(() => {
    console.log("data", measurementData);
  }, [measurementData]);

  const heightChartData =
    growthChartData?.heightChart?.lines?.child?.map(
      (childPoint: any, index: number) => {
        const whoPoint = growthChartData.heightChart.lines.whoMedian[index];

        return {
          age: childPoint.age,
          child: childPoint.value,
          whoMedian: whoPoint?.value ?? null,
        };
      }
    ) ?? [];

  const weightChartData =
    growthChartData?.weightChart?.lines?.child?.map((childPoint: any) => ({
      age: childPoint.age,
      child: childPoint.value,
    })) ?? [];

  return (
    <SidebarLayout>
      <main className="w-full">
        <GrafikPertumbuhanAnakHeroSection
          router={nameSpace.router}
          heightChartData={heightChartData}
          weightChartData={weightChartData}
          summary={growthChartData?.summary}
          historyMeasument={measurementData ?? []}
        />
      </main>
    </SidebarLayout>
  );
};

export default GrafikPertumbuhanAnakContainer;
