"use client";

import NotifikasiFormSection from "@/components/section/private/posyandu/notifikasi/form/notifikasi-form-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateNotification } from "@/types/form/notafications.form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateNotifikasiContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();

  const notifikasiQuery = service.notafication.query.getNotificationByID(id);
  const notifikasiData = notifikasiQuery.data?.data ?? null;

  const updateMutation = service.notafication.mutation.update();

  const [form, setForm] = useState<FormCreateNotification>({
    userId: "",
    title: "",
    message: "",
    type: "reminder",
  });

  useEffect(() => {
    if (!notifikasiData) return;
    setForm((prev) => ({
      ...prev,
      userId:
        (notifikasiData as unknown as { userId?: string; userID?: string })
          .userId ??
        (notifikasiData as unknown as { userId?: string; userID?: string })
          .userID ??
        "",
      title: notifikasiData.title ?? "",
      message: notifikasiData.message ?? "",
      type: notifikasiData.type ?? "reminder",
    }));
  }, [notifikasiData?.id]);

  const handleSubmit = () => {
    if (!id) return null;
    if (!form.title || !form.message) {
      return namespace.alert.toast({
        title: "Perhatian",
        message: "Mengisi Field",
        icon: "warning",
      });
    }

    updateMutation.mutate(
      { id, data: form },
      {
        onSuccess: () => {
          namespace.router.push("/posyandu/notifikasi");
        },
      },
    );
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <NotifikasiFormSection
          namespace={{ router: namespace.router }}
          service={{
            mutation: {
              onSubmit: handleSubmit,
              isPending: updateMutation.isPending || notifikasiQuery.isLoading,
            },
          }}
          state={{ form, setForm }}
          title="Update Notifikasi"
          submitLabel="Update"
        />
      </main>
    </SidebarLayout>
  );
};

export default UpdateNotifikasiContainer;
