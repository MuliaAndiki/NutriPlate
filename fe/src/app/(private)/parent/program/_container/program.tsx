"use client";
import ProgramHeroSection from "@/components/section/private/parent/program/program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";
const ProgramParentContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //child
  const childQuery = service.user.query.childAll({
    role: selector.role!,
  });
  const childData = childQuery.data?.data ?? [];

  //program
  const programsQuery = service.program.query.getPrograms();
  const programData = programsQuery.data?.data ?? [];

  //statusr registerion
  const registerionQuery = service.programRegistraion.query.getMyStatus();
  const registerionData = registerionQuery.data?.data ?? [];

  //state
  const [programFilter, setProgramFilter] = useState<"ALL" | "FOLLOWED">("ALL");

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProgramHeroSection
          service={{
            query: {
              childType: childData ?? [],
              programType: programData ?? [],
              isLoading:
                programsQuery.isLoading ||
                childQuery.isLoading ||
                registerionQuery.isLoading,
              statusChild: registerionData ?? [],
            },
          }}
          namespace={{
            pathname: nameSpace.pathname,
            router: nameSpace.router,
          }}
          state={{
            programFilter: programFilter,
            setProgramFilter: setProgramFilter,
          }}
          selector={{
            role: selector.role!,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgramParentContainer;
