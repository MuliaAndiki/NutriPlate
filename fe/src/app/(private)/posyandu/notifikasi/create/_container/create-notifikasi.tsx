"use client";

import NotifikasiFormSection from "@/components/section/private/posyandu/notifikasi/form/notifikasi-form-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateNotification } from "@/types/form/notafications.form";
import { useState } from "react";

const CreateNotifikasiContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const createMutation = service.notafication.mutation.create();

  const [form, setForm] = useState<FormCreateNotification>({
    userId: "",
    title: "",
    message: "",
    type: "reminder",
  });

  const handleSubmit = () => {
    if (!form.title || !form.message) {
      return namespace.alert.toast({
        title: "Perhatian",
        message: "Mengisi Field",
        icon: "warning",
      });
    }

    createMutation.mutate(form, {
      onSuccess: () => {
        namespace.router.push("/posyandu/notifikasi");
      },
    });
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <NotifikasiFormSection
          namespace={{ router: namespace.router }}
          service={{
            mutation: {
              onSubmit: handleSubmit,
              isPending: createMutation.isPending,
            },
          }}
          state={{ form, setForm }}
          title="Tambah Notifikasi"
          submitLabel="Simpan"
        />
      </main>
    </SidebarLayout>
  );
};

export default CreateNotifikasiContainer;
