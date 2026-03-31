"use client";

import IotAdminSection from "@/components/section/private/admin/iot/iot-admin-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { FormRegisterDevice } from "@/types/form";
import { useEffect, useMemo, useState } from "react";

const IotAdminContainer = () => {
  const service = useService();

  const allDevicesQuery = service.iot.query.getAllDevices();
  const allDevicesData = allDevicesQuery.data?.data?.data ?? [];

  const [selectedToken, setSelectedToken] = useState<string>("");
  const [registerForm, setRegisterForm] = useState<FormRegisterDevice>({
    token: "",
    name: "",
    parentId: "",
    posyanduId: "",
    pairingToken: "",
  });
  const [editForm, setEditForm] = useState({
    deviceName: "",
    parentId: "",
    posyanduId: "",
    pairingToken: "",
    batteryLevel: "",
    firmwareVersion: "",
    ipAddress: "",
  });

  const selectedDevice = useMemo(
    () =>
      allDevicesData.find((item) => item.deviceToken === selectedToken) ?? null,
    [allDevicesData, selectedToken],
  );

  useEffect(() => {
    if (!selectedToken && allDevicesData.length > 0) {
      setSelectedToken(allDevicesData[0].deviceToken);
    }
  }, [allDevicesData, selectedToken]);

  useEffect(() => {
    if (!selectedDevice) return;

    setEditForm({
      deviceName: selectedDevice.deviceName ?? "",
      parentId: selectedDevice.parentId ?? "",
      posyanduId: selectedDevice.posyanduId ?? "",
      pairingToken: selectedDevice.pairingToken ?? "",
      batteryLevel: selectedDevice.batteryLevel?.toString() ?? "",
      firmwareVersion: selectedDevice.firmwareVersion ?? "",
      ipAddress: selectedDevice.ipAddress ?? "",
    });
  }, [selectedDevice]);

  const registerMutation = service.iot.mutation.registerDevice();
  const updateMutation = service.iot.mutation.updateDevice();
  const deleteMutation = service.iot.mutation.deleteDevice();
  const rebootMutation = service.iot.mutation.rebootIot();

  const handleRegister = () => {
    if (!registerForm.token || !registerForm.name) return;

    registerMutation.mutate({
      token: registerForm.token,
      name: registerForm.name,
      parentId: registerForm.parentId || undefined,
      posyanduId: registerForm.posyanduId || undefined,
      pairingToken: registerForm.pairingToken || undefined,
    });
  };

  const handleUpdate = () => {
    if (!selectedToken) return;

    updateMutation.mutate({
      token: selectedToken,
      payload: {
        deviceName: editForm.deviceName || undefined,
        parentId: editForm.parentId || null,
        posyanduId: editForm.posyanduId || null,
        pairingToken: editForm.pairingToken || null,
        batteryLevel: editForm.batteryLevel
          ? Number(editForm.batteryLevel)
          : null,
        firmwareVersion: editForm.firmwareVersion || null,
        ipAddress: editForm.ipAddress || null,
      },
    });
  };

  const handleDelete = () => {
    if (!selectedToken) return;

    deleteMutation.mutate(
      { token: selectedToken },
      {
        onSuccess: () => {
          setSelectedToken("");
        },
      },
    );
  };

  const handleReboot = () => {
    if (!selectedToken) return;
    rebootMutation.mutate({ token: selectedToken });
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <IotAdminSection
          service={{
            query: {
              isLoading: allDevicesQuery.isLoading,
              devices: allDevicesData,
              selectedToken,
              selectedDevice,
            },
            mutation: {
              isPending:
                registerMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending ||
                rebootMutation.isPending,
              onRegister: handleRegister,
              onUpdate: handleUpdate,
              onDelete: handleDelete,
              onReboot: handleReboot,
            },
          }}
          state={{
            setSelectedToken,
            registerForm,
            setRegisterForm,
            editForm,
            setEditForm,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default IotAdminContainer;
