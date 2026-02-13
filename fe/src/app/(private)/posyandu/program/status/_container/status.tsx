"use client";
import StatusChildInProgramSection from "@/components/section/private/posyandu/program/status/status-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { RegistrationStatus } from "@/types/partial";
import { ProgramRegistrationDetailResponse } from "@/types/res";
import { useMemo, useState } from "react";

const StatusChildInProgramContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  //register
  const registerchildQuery = service.programRegistraion.query.getMyStatus();
  const registerchildData = registerchildQuery.data?.data ?? [];

  const acceptMutation =
    service.programRegistraion.mutation.acceptRegistration();
  const rejectMutation =
    service.programRegistraion.mutation.rejectRegistration();
  const [statusFilter, setStatusFilter] = useState<"all" | RegistrationStatus>(
    "all",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredRegister = useMemo(() => {
    if (statusFilter === "all") return registerchildData;
    return registerchildData.filter(
      (item: ProgramRegistrationDetailResponse) => item.status === statusFilter,
    );
  }, [statusFilter, registerchildData]);

  //
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <StatusChildInProgramSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              isLoading: registerchildQuery.isLoading,
              registerChild: filteredRegister,
            },
            mutation: {
              onAccept: (id) => {
                if (!id) return;
                acceptMutation.mutate({ id });
              },
              onReject: (id) => {
                if (!id) return;
                rejectMutation.mutate({ id });
              },
              isPending: acceptMutation.isPending || rejectMutation.isPending,
            },
          }}
          state={{
            value: statusFilter,
            onChange: setStatusFilter,
            selectedId: selectedId,
            onSelect: setSelectedId,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default StatusChildInProgramContainer;
