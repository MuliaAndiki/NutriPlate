"use client";

import GrafikPertumbuhanAnakHeroSection from "@/components/section/private/parent/detail-profile-anak/grafik-pertumbuhan-anak/grafik-pertumbuhan-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const GrafikPertumbuhanAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const { id } = useParams<{ id: string }>();
  const service = useService();

  const growthChartQuery = service.measuremnt.query.growthChart(id);
  const measurementQuery = service.measuremnt.query.measurement(id);
  const growthChartData = growthChartQuery.data?.data ?? null;
  const measurementData = measurementQuery.data?.data ?? [];

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

  const title = {
    weight: "Grafik Berat Badan vs Usia",
    height: "Grafik Tinggi Badan vs Usia",
  };

  return (
    <SidebarLayout>
      <main className="w-full">
        <GrafikPertumbuhanAnakHeroSection
          namespace={{
            router: nameSpace.router,
          }}
          servive={{
            query: {
              heightChartData: heightChartData,
              historyMeasument: measurementData,
              summary: growthChartData?.summary,
              weightChartData: weightChartData,
            },
          }}
          state={{
            title: title,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default GrafikPertumbuhanAnakContainer;
