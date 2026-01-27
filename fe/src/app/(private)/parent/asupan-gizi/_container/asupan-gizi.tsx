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
  // food history
  const footHistoryQuery = service.foodIntake.query.getHistoryFoodIntake();
  const footHistoryData = footHistoryQuery.data?.data ?? [];

  const [showFlowPopUp, setShowFlowPopUp] = useState(false);
  const [cameraFlow, setCameraFlow] = useState<CameraFlowType>(null);
  const createFoodMutation = service.foodIntake.mutation.createFoodIntake();

  //state
  const [isScaling, setIsScaling] = useState<boolean>(false);
  const [holdingWeight, setHoldingWeight] = useState<number>(0);

  //iot status
  const iotStatusQuery = service.iot.query.getStatusIot();
  const iotStatusData = iotStatusQuery.data?.data ?? null;

  // weight
  const weightQuery = service.iot.query.getWeight({
    enabled: isScaling,
    refetchInterval: isScaling ? 500 : false,
    staleTime: 0,
  });
  const weightData = isScaling ? (weightQuery.data ?? null) : null;

  // mutation
  const startScaleMutation = service.iot.mutation.startScale();
  const tareModeMutation = service.iot.mutation.tareMode();
  const cancelStartMutation = service.iot.mutation.cancelStart();
  const holdWeightMutation = service.iot.mutation.HoldWeight();
  const rejectWeightMutation = service.iot.mutation.rejectWeight();
  const onConfirmWeightMutation = service.iot.mutation.confirmWeight();

  //error handling
  const ensureIotReady = () => {
    if (!iotStatusData?.id) {
      namespace.alert.toast({
        title: "Timbangan belum terhubung",
        message: "Silakan hubungkan timbangan terlebih dahulu",
        icon: "error",
      });
      return false;
    }
    return true;
  };
  //handler
  const handleStartScale = () => {
    if (!ensureIotReady()) return null;

    startScaleMutation.mutate(
      {},
      {
        onSuccess: () => {
          setHoldingWeight(0);
          setIsScaling(true);
        },
        onError: () => {
          iotStatusQuery.refetch();
        },
      },
    );
  };

  const handleConnectIot = async () => {
    try {
      const res = await iotStatusQuery.refetch();

      const freshIotData = res.data?.data ?? null;

      if (!freshIotData) {
        window.open("http://192.168.4.1", "_blank");
      }
    } catch (err) {
      window.open("http://192.168.4.1", "_blank");
    }
  };

  const handleConfirmWeight = () => {
    if (!ensureIotReady()) return null;

    onConfirmWeightMutation.mutate(
      {},
      {
        //moce logic here
        onSuccess: (res) => {
          setIsScaling(false);
          setHoldingWeight(0);
          handleOpenScanPopUp();
        },
        onError: () => {
          iotStatusQuery.refetch();
        },
      },
    );
  };

  const handleRejectWeight = () => {
    if (!ensureIotReady()) return null;

    rejectWeightMutation.mutate(
      {},
      {
        onSuccess: () => {
          setHoldingWeight(0);
          setIsScaling(false);
        },
        onError: () => {
          iotStatusQuery.refetch();
        },
      },
    );
  };

  const handleHoldWeight = () => {
    if (!ensureIotReady()) return null;
    holdWeightMutation.mutate(
      {},
      {
        onSuccess: (res) => {
          setIsScaling(false);
          setHoldingWeight(res.data.weight);
        },
        onError: () => {
          iotStatusQuery.refetch();
        },
      },
    );
  };

  const handleCancleStart = () => {
    if (!ensureIotReady()) return null;

    cancelStartMutation.mutate(
      {},
      {
        onSuccess: () => {
          setHoldingWeight(0);
          setIsScaling(false);
        },
        onError: () => {
          iotStatusQuery.refetch();
        },
      },
    );
  };
  const handleTareMode = () => {
    if (!ensureIotReady()) return null;

    tareModeMutation.mutate(
      {},
      {
        onSuccess: () => {
          setHoldingWeight(0);
          setIsScaling(true);
        },
        onError: () => {
          iotStatusQuery.refetch();
        },
      },
    );
  };

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
      message: "Kamu Akan Di Arahkan Kehalaman Program",
      icon: "info",
      onVoid: () => {
        namespace.router.push("/parent/program");
      },
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
              isLoading:
                footHistoryQuery.isLoading ||
                iotStatusQuery.isLoading ||
                weightQuery.isLoading,
              iot: iotStatusData ?? null,
              weightIot: weightData,
            },
            mutation: {
              isPending:
                startScaleMutation.isPending ||
                tareModeMutation.isPending ||
                cancelStartMutation.isPending ||
                holdWeightMutation.isPending ||
                rejectWeightMutation.isPending ||
                onConfirmWeightMutation.isPending,
              onStartScale: handleStartScale,
              onTareScale: handleTareMode,
              onCancelStart: handleCancleStart,
              onHoldWeight: handleHoldWeight,
              onRejectWeight: handleRejectWeight,
              onConfirmWeight: handleConfirmWeight,
            },
          }}
          actions={{
            handleSelectManualScan: handleSelectManualScan,
            handleSelectTaskScan: handleSelectTaskScan,
            onConnectIot: handleConnectIot,
          }}
          state={{
            setShowFlowPopUp: setShowFlowPopUp,
            showFlowPopUp: showFlowPopUp,
            isActive: isScaling,
            holdingWeight: holdingWeight,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default AsupanGiziContainer;
