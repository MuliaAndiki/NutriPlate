"use client";
import ProgramHeroSection from "@/components/section/private/parent/program/program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
const ProgramParentContainer = () => {
  const service = useService();
  const childQuery = service.user.query.childAll();
  const childData = childQuery.data?.data ?? [];
  const programsQuery = service.program.query.getPrograms();
  const programData = programsQuery.data?.data ?? [];
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
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgramParentContainer;
