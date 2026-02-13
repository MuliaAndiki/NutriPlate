"use client";

import CreateProgramSection from "@/components/section/private/posyandu/program/create-program/create-program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateProgram } from "@/types/form/program.form";
import { useState } from "react";

const CreateProgramContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  const createProgramMutation = service.program.mutation.createProgram();

  const [formCreateProgram, setFormCreateProgram] = useState<FormCreateProgram>(
    {
      name: "",
      description: "",
      durationRegister: "",
      endPrograms: "",
      activity: [],
      benefit: [],
    },
  );

  const handleCreateProgram = () => {
    if (!formCreateProgram.name || !formCreateProgram.description) {
      return namespace.alert.toast({
        title: "Perhatian",
        message: "Mengisi Field",
        icon: "warning",
      });
    }

    if (!selector.posyanduId) return null;

    createProgramMutation.mutate(
      {
        id: selector.posyanduId,
        payload: formCreateProgram,
      },
      {
        onSuccess: () => {
          namespace.router.push("/posyandu/program");
        },
      },
    );
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <CreateProgramSection
          namespace={{ router: namespace.router }}
          service={{
            mutation: {
              isPending: createProgramMutation.isPending,
              onCreate: handleCreateProgram,
            },
          }}
          state={{
            formCreateProgram,
            setFormCreateProgram,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default CreateProgramContainer;
