"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FoodCameraSection from "@/components/section/general/food/camera-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { cacheKey } from "@/configs/cache.config";

const FoodCameraContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const namespace = useAppNameSpace();
  const service = useService();

  // Get params from URL
  const childId = searchParams.get("childId") || "";
  const iotId = searchParams.get("iotId") || undefined;
  const flowType =
    (searchParams.get("flowType") as "normal" | "task" | null) || "normal";
  const taskName = searchParams.get("taskName") || undefined;
  const iotWeight = Number(searchParams.get("iotWeight")) || 0;

  // Fetch daily summary using service
  const dailySummaryQuery = service.foodSummary.query.foodSummaryDaily(childId);
  const dailySummaryData = dailySummaryQuery.data?.data ?? null;

  const createFoodIntake = service.foodIntake.mutation.createFoodIntake();
  const markTaskDoneMutation = service.task.mutation.doneTask();

  const handleSuccess = () => {
    namespace.queryClient.invalidateQueries({
      queryKey: cacheKey.foodIntake.list(),
    });

    // Handle task completion if in task flow
    if (flowType === "task") {
      namespace.alert.toast({
        title: "Sukses!",
        message: "Task selesai dan makanan ditambahkan",
        icon: "success",
      });

      setTimeout(() => {
        router.back();
      }, 500);
    } else {
      namespace.alert.toast({
        title: "Berhasil",
        message: "Asupan makanan berhasil disimpan",
        icon: "success",
      });
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <FoodCameraSection
          service={{
            foodIntake: {
              createFoodIntake,
            },
          }}
          state={{
            childId,
            iotId,
            flowType,
            taskName,
            iotWeight,
            dailySummary: dailySummaryData ?? null,
            isLoading: dailySummaryQuery.isLoading,
          }}
          actions={{
            onSuccess: handleSuccess,
            onCancel: handleCancel,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default FoodCameraContainer;
