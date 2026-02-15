"use client";
import AsupanGiziHeroSection from "@/components/section/private/parent/asupan-gizi/asupan-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useEffect, useState } from "react";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useAppSelector } from "@/hooks/dispatch/dispatch";

const AsupanGiziContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);
  // food history
  const footHistoryQuery = service.foodIntake.query.getHistoryFoodIntake();
  const footHistoryData = footHistoryQuery.data?.data ?? [];
  //state
  const [showFlowPopUp, setShowFlowPopUp] = useState(false);
  const [isScaling, setIsScaling] = useState<boolean>(false);
  const [holdingWeight, setHoldingWeight] = useState<number>(0);
  const [selectChildId, setSelectChildId] = useState<string>("");
  const [isLoadingConnect, setIsLoadingConnect] = useState<boolean>(false);

  // iot devices
  const iotDevicesQuery = service.iot.query.getDevices();
  const iotDevicesData = iotDevicesQuery.data?.data ?? [];
  const onlineDevices = iotDevicesData.filter(
    (item) => item.status === "online",
  );
  const [selectedDeviceToken, setSelectedDeviceToken] = useState<string>("");
  const activeDeviceToken =
    selectedDeviceToken || onlineDevices[0]?.deviceToken || "";
  const activeDevice =
    onlineDevices.find((item) => item.deviceToken === activeDeviceToken) ??
    null;

  useEffect(() => {
    if (onlineDevices.length === 0) {
      if (selectedDeviceToken) {
        setSelectedDeviceToken("");
      }
      return;
    }
    if (!selectedDeviceToken && onlineDevices.length > 0) {
      setSelectedDeviceToken(onlineDevices[0].deviceToken);
      return;
    }
    if (
      selectedDeviceToken &&
      !onlineDevices.some((item) => item.deviceToken === selectedDeviceToken)
    ) {
      setSelectedDeviceToken(onlineDevices[0].deviceToken);
    }
  }, [onlineDevices, selectedDeviceToken]);

  // iot status
  const iotStatusQuery = service.iot.query.getDeviceDetail(activeDeviceToken, {
    enabled: Boolean(activeDeviceToken),
    refetchInterval: isScaling ? 500 : false,
    staleTime: 0,
  });
  const iotStatusData = iotStatusQuery.data?.data ?? null;

  // child
  const childQuery = service.user.query.childAll({
    role: selector.role!,
  });
  const childData = childQuery.data?.data ?? [];

  // weight
  const weightData =
    iotStatusData?.lastStableWeight && iotStatusData.lastStableWeight > 0
      ? iotStatusData.lastStableWeight
      : (iotStatusData?.lastWeight ?? null);

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
      { token: activeDeviceToken },
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
    setIsLoadingConnect(true);

    try {
      const res = await iotDevicesQuery.refetch();
      const freshIotData = res.data?.data ?? [];

      if (!freshIotData.length) {
        window.open("http://nutriplate.local", "_blank");
      }
    } catch (err) {
      window.open("http://nutriplate.local", "_blank");
    } finally {
      setIsLoadingConnect(false);
    }
  };
  const handleConfirmWeight = () => {
    if (!ensureIotReady()) return null;

    onConfirmWeightMutation.mutate(
      { token: activeDeviceToken },
      {
        onSuccess: () => {
          const confirmedWeight =
            iotStatusData?.lastStableWeight &&
            iotStatusData.lastStableWeight > 0
              ? iotStatusData.lastStableWeight
              : (iotStatusData?.lastWeight ?? holdingWeight);
          setHoldingWeight(confirmedWeight);
          setIsScaling(false);
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
      { token: activeDeviceToken },
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
      { token: activeDeviceToken },
      {
        onSuccess: () => {
          setIsScaling(false);
          setHoldingWeight(
            iotStatusData?.lastStableWeight &&
              iotStatusData.lastStableWeight > 0
              ? iotStatusData.lastStableWeight
              : (iotStatusData?.lastWeight ?? 0),
          );
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
      { token: activeDeviceToken },
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
      { token: activeDeviceToken },
      {
        onSuccess: () => {
          setHoldingWeight(0);
          setIsScaling(false);
          setTimeout(() => {
            iotStatusQuery.refetch();
          }, 800);
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
    setShowFlowPopUp(false);
    namespace.router.push(
      `/foodCamera?childId=${selectChildId}&iotId=${iotStatusData?.id || ""}&flowType=normal&iotWeight=${holdingWeight}`,
    );
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

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <AsupanGiziHeroSection
          service={{
            query: {
              historyFood: footHistoryData ?? [],
              isLoading:
                footHistoryQuery.isLoading ||
                iotDevicesQuery.isLoading ||
                iotStatusQuery.isLoading ||
                childQuery.isLoading,
              iot: iotStatusData ?? null,
              iotDevices: onlineDevices,
              selectedDeviceToken: activeDeviceToken,
              weightIot: weightData !== null ? { weight: weightData } : null,
              child: childData ?? [],
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
            onSelectDevice: setSelectedDeviceToken,
          }}
          state={{
            setShowFlowPopUp: setShowFlowPopUp,
            showFlowPopUp: showFlowPopUp,
            isActive: isScaling,
            holdingWeight: holdingWeight,
            selectChildId: selectChildId,
            setSelectChildId: setSelectChildId,
            isLoadingConnect: isLoadingConnect,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default AsupanGiziContainer;
