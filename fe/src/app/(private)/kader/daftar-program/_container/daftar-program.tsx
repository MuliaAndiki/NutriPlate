"use client";
import DaftarProgramKaderSection from "@/components/section/private/kader/daftar-program/daftar-program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const DaftarProgramKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const programsQuery = service.program.query.getPrograms();
  const programData = programsQuery.data?.data ?? [];
  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <DaftarProgramKaderSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              isLoading: programsQuery.isLoading,
              program: programData ?? [],
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarProgramKaderContainer;
