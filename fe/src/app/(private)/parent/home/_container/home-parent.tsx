"use client";
import HomeParentHeroSection from "@/components/section/private/parent/home/home-parent-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";

const HomeParentContainer = () => {
  const service = useService();
  const namespace = useAppNameSpace();
  const selector = useAppSelector((state) => state.posyandu);

  //state
  const [selectedDeviceToken, setSelectedDeviceToken] = useState<string>("");
  const [isScaling, setIsScaling] = useState<boolean>(false);

  //profile
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;

  const notifikasiQuery = service.notafication.query.getNotification(
    selector.token!,
  );
  const notifikasiData = notifikasiQuery.data?.data ?? [];

  //child
  const childrenQuery = service.user.query.childAll({
    role: selector.role!,
  });
  const childrenData = childrenQuery.data?.data ?? [];

  //iot
  const iotDevicesQuery = service.iot.query.getDevices();
  const iotDevicesData = iotDevicesQuery.data?.data ?? [];
  const onlineDevices = iotDevicesData.filter(
    (item) => item.status === "online",
  );

  const activeDeviceToken =
    selectedDeviceToken || onlineDevices[0]?.deviceToken || "";

  //iot status
  const iotStatusQuery = service.iot.query.getDeviceDetail(activeDeviceToken, {
    enabled: Boolean(activeDeviceToken),
    refetchInterval: isScaling ? 500 : false,
    staleTime: 0,
  });
  const iotStatusData = iotStatusQuery.data?.data ?? null;

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

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeParentHeroSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              profile: profileData ?? null,
              isLoading:
                profileQuery.isLoading ||
                notifikasiQuery.isLoading ||
                childrenQuery.isLoading ||
                iotDevicesQuery.isLoading,
              notifikasi: notifikasiData ?? [],
              children: childrenData ?? [],
              selectedDeviceToken: selectedDeviceToken,
              iotDevices: iotDevicesData,
              iot: iotStatusData ?? null,
            },
          }}
          actions={{
            onSelectDevice: setSelectedDeviceToken,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default HomeParentContainer;
