"use client";
import StatusKaderSection from "@/components/section/private/posyandu/daftar-kader/status/status-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { StatusRegisterionsKader } from "@/types/partial";
import { useMemo, useState } from "react";

const StatusKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  //pending register
  const pendingRegisterQuery = service.registerKader.query.getPendingRegister();
  const pendingRegisterData = pendingRegisterQuery.data?.data ?? [];

  //accepted register
  const acceptedRegisterQuery =
    service.registerKader.query.getAcceptedRegister();
  const acceptedRegisterData = acceptedRegisterQuery.data?.data ?? [];

  //reject register
  const rejectRegisterQuery = service.registerKader.query.getRejectRegister();
  const rejectRegisterData = rejectRegisterQuery.data?.data ?? [];

  //mutation
  const acceptedMutation = service.registerKader.mutation.acceptedKader();
  const rejectedMutation = service.registerKader.mutation.rejectedKader();

  const allRegister = useMemo(() => {
    return [
      ...pendingRegisterData,
      ...acceptedRegisterData,
      ...rejectRegisterData,
    ];
  }, [pendingRegisterData, acceptedRegisterData, rejectRegisterData]);
  //state
  const [idRegister, setIdRegister] = useState<string>("");
  const [statusFilter, setStatusFilter] =
    useState<StatusRegisterionsKader>("all");

  const filteredRegister = useMemo(() => {
    if (statusFilter === "all") return allRegister;

    return allRegister.filter((item) => item.status === statusFilter);
  }, [statusFilter, allRegister]);

  // handler
  const handleAccepted = () => {
    if (!idRegister) return null;
    acceptedMutation.mutate({
      id: idRegister,
    });
  };

  const handleReject = () => {
    if (!idRegister) return null;
    rejectedMutation.mutate({
      id: idRegister,
    });
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <StatusKaderSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              data: filteredRegister ?? [],
              isLoading:
                pendingRegisterQuery.isLoading ||
                acceptedRegisterQuery.isLoading ||
                rejectRegisterQuery.isLoading,
            },
            mutation: {
              isPending:
                acceptedMutation.isPending || rejectedMutation.isPending,
              onAccepted: handleAccepted,
              onReject: handleReject,
            },
          }}
          state={{
            value: statusFilter,
            onChange: setStatusFilter,
            idRegister: idRegister,
            setIdRegister: setIdRegister,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default StatusKaderContainer;
