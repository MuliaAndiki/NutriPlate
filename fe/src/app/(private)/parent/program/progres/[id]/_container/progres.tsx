"use client";
import ProgresProgramSection from "@/components/section/private/parent/program/progres/progres-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCancelPrograms } from "@/types/form/progres.form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProgresProgramContainer = () => {
  const namespace = useAppNameSpace();
  const { id } = useParams<{ id: string }>();
  const service = useService();
  //child
  const childQueryById = service.user.query.childById(id);
  const childDataById = childQueryById.data?.data ?? null;
  //progres
  const progresInChildQueryById = service.progres.query.progresInChild(id);
  const progresInChildDataById = progresInChildQueryById.data?.data ?? null;

  //mutation
  const cancelProgramMutation = service.progres.mutation.cancelProgram();

  const [formCancelProgram, setFormCancelProgram] =
    useState<FormCancelPrograms>({
      childId: "",
    });

  const handleCancelProgram = () => {
    if (!progresInChildDataById.id || !formCancelProgram.childId) return null;
    cancelProgramMutation.mutate({
      id: progresInChildDataById.id,
      payload: {
        childId: id,
      },
    });
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProgresProgramSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              childType: childDataById ?? null,
              isLoading:
                childQueryById.isLoading || progresInChildQueryById.isLoading,
            },
            mutation: {
              cancelProgram: handleCancelProgram,
              isPending: cancelProgramMutation.isPending,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresProgramContainer;
