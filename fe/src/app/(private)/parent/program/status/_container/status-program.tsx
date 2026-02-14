"use client";
import StatusProgramSection from "@/components/section/private/parent/program/status/status-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const StatusProgramContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const statusChildQuery = service.programRegistraion.query.getMyStatus();
  const statusChildData = statusChildQuery.data?.data ?? null;

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden p-2">
        <StatusProgramSection
          namespace={{
            router: nameSpace.router,
          }}
          service={{
            query: {
              statusChild: statusChildData ?? [],
              isLoading: statusChildQuery.isLoading,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default StatusProgramContainer;
