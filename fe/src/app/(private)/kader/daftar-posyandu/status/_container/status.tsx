"use client";

import StatusKaderSection from "@/components/section/private/kader/daftar-posyandu/status/status-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useMemo, useState } from "react";
import { KaderRegistrationDetailResponse } from "@/types/res";
import { StatusRegisterionsKader } from "@/types/partial";

const StatusKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  const [statusFilter, setStatusFilter] =
    useState<StatusRegisterionsKader>("all");

  const myRegisterQuery = service.registerKader.query.getMyRegister();
  const myRegisterData = myRegisterQuery.data?.data ?? [];

  const filteredRegister = useMemo(() => {
    if (statusFilter === "all") return myRegisterData;

    return myRegisterData.filter(
      (item: KaderRegistrationDetailResponse) => item.status === statusFilter,
    );
  }, [statusFilter, myRegisterData]);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <StatusKaderSection
          namespace={{ router: namespace.router }}
          service={{
            query: {
              isLoading: myRegisterQuery.isLoading,
              myRegister: filteredRegister,
            },
          }}
          state={{
            value: statusFilter,
            onChange: setStatusFilter,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default StatusKaderContainer;
