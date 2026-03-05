"use client";
import DetectionMakananSection from "@/components/section/general/detection-food/page-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FoodClassRespone } from "@/types/res";
import { useMemo, useState } from "react";

const DetectionMakananContainer = () => {
  const service = useService();
  const [searchValue, setSearchValue] = useState("");
  const namespace = useAppNameSpace();

  const foodClasesQuery = service.foodSummary.query.foofClases();
  const foodClasesData = foodClasesQuery.data?.data ?? [];
  const filteredFood = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return foodClasesData;

    return foodClasesData.filter((item: FoodClassRespone) => {
      const targets = [
        item.name,
        item.category,
        item.metadata?.label,
        item.metadata?.source,
        item.metadata?.note,
      ];

      return targets.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [foodClasesData, searchValue]);

  return (
    <main className="w-full min-h-screen">
      <DetectionMakananSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          query: {
            food: filteredFood ?? [],
            totalFood: foodClasesData.length,
            isLoading: foodClasesQuery.isLoading,
          },
        }}
        state={{
          search: {
            value: searchValue,
            onChange: setSearchValue,
          },
        }}
      />
    </main>
  );
};

export default DetectionMakananContainer;
