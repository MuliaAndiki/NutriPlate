"use client";
import AsupanGiziHeroSection from "@/components/section/private/parent/asupan-gizi/asupan-gizi-section";
import FoodCamera from "@/components/card/food/food-camera";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useState } from "react";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { cacheKey } from "@/configs/cache.config";

type CameraFlowType = null | "normal" | "task";

const AsupanGiziContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const footHistoryQuery = service.foodIntake.query.getHistoryFoodIntake();
  const footHistoryData = footHistoryQuery.data?.data ?? [];

  const [showFlowPopUp, setShowFlowPopUp] = useState(false);
  const [cameraFlow, setCameraFlow] = useState<CameraFlowType>(null);

  const createFoodMutation = service.foodIntake.mutation.createFoodIntake();

  const handleOpenScanPopUp = () => {
    setShowFlowPopUp(true);
  };

  const handleSelectManualScan = () => {
    setCameraFlow("normal");
    setShowFlowPopUp(false);
  };

  const handleSelectTaskScan = () => {
    setShowFlowPopUp(false);
    namespace.alert.toast({
      title: "Info",
      message: "Scan untuk task dilakukan di halaman detail program",
      icon: "info",
    });
  };

  const handleCancelCamera = () => {
    setCameraFlow(null);
  };

  const handlePhotoCapture = async (photoBlob: Blob, weight: number) => {
    const childId = "";

    if (!childId) {
      namespace.alert.toast({
        title: "Error",
        message: "Child ID tidak ditemukan",
        icon: "error",
      });
      return;
    }

    try {
      await createFoodMutation.mutateAsync({
        photoBlob,
        childId,
        totalWeightGram: weight,
      });

      namespace.alert.toast({
        title: "Success",
        message: "Makanan berhasil ditambahkan",
        icon: "success",
      });

      handleCancelCamera();

      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.foodIntake.list(),
      });
    } catch (error) {
      namespace.alert.toast({
        title: "Error",
        message: error instanceof Error ? error.message : "Upload gagal",
        icon: "error",
      });
    }
  };

  if (cameraFlow) {
    return (
      <SidebarLayout>
        <FoodCamera
          flowType={cameraFlow}
          onCancel={handleCancelCamera}
          onCapture={handlePhotoCapture}
          isLoading={createFoodMutation.isPending}
          taskName={undefined}
        />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <AsupanGiziHeroSection
          service={{
            query: {
              historyFood: footHistoryData ?? [],
              isLoading: footHistoryQuery.isLoading,
            },
          }}
          actions={{
            onOpenScanPopUp: handleOpenScanPopUp,
            handleSelectManualScan: handleSelectManualScan,
            handleSelectTaskScan: handleSelectTaskScan,
          }}
          state={{
            setShowFlowPopUp: setShowFlowPopUp,
            showFlowPopUp: showFlowPopUp,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default AsupanGiziContainer;
