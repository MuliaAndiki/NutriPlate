"use client";
import ProgramHeroSection from "@/components/section/private/parent/program/program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";
const ProgramParentContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const childQuery = service.user.query.childAll();
  const childData = childQuery.data?.data ?? [];
  const programsQuery = service.program.query.getPrograms();
  const programData = programsQuery.data?.data ?? [];
  const [programFilter, setProgramFilter] = useState<"ALL" | "FOLLOWED">("ALL");

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProgramHeroSection
          service={{
            query: {
              childType: childData ?? [],
              programType: programData ?? [],
            },
          }}
          namespace={{
            pathname: nameSpace.pathname,
          }}
          state={{
            programFilter: programFilter,
            setProgramFilter: setProgramFilter,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgramParentContainer;
