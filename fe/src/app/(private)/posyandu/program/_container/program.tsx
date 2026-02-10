"use client";
import ProgramPosyanduSection from "@/components/section/private/posyandu/program/program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const ProgramPosyanduContainer = () => {
  const service = useService();
  const namespace = useAppNameSpace();
  const selector = useAppSelector((state) => state.posyandu);

  //program
  const programQuery = service.program.query.getPrograms();
  const programData = programQuery.data?.data ?? [];
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <ProgramPosyanduSection
          service={{
            query: {
              isLoading: programQuery.isLoading,
              program: programData ?? [],
            },
          }}
          namespace={{
            router: namespace.router,
          }}
          selector={{
            role: selector.role!,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgramPosyanduContainer;
