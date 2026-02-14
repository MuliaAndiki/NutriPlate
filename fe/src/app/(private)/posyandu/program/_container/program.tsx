"use client";
import ProgramPosyanduSection from "@/components/section/private/posyandu/program/program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { ProgramRespone } from "@/types/res/program-with-progres";
import { useMemo, useState } from "react";

const ProgramPosyanduContainer = () => {
  const service = useService();
  const namespace = useAppNameSpace();
  const selector = useAppSelector((state) => state.posyandu);
  const [filter, setFilter] = useState<"running" | "all">("running");

  //program
  const programQuery = service.program.query.getPrograms();
  const programData = programQuery.data?.data ?? [];

  //status child
  const childRegisterQuery = service.programRegistraion.query.getMyStatus();
  const childRegisterData = childRegisterQuery.data?.data ?? [];

  const filteredProgram = useMemo<ProgramRespone[]>(() => {
    if (filter === "all") return programData;
    const now = new Date();
    return programData.filter((program: any) => {
      const start = program.startPrograms
        ? new Date(program.startPrograms)
        : null;
      const end = program.endPrograms ? new Date(program.endPrograms) : null;

      if (!start && !end) return true;
      if (start && end) return start <= now && now <= end;
      if (start && !end) return start <= now;
      if (!start && end) return now <= end;
      return false;
    });
  }, [filter, programData]);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <ProgramPosyanduSection
          service={{
            query: {
              isLoading: programQuery.isLoading || childRegisterQuery.isLoading,
              program: programData ?? [],
              filteredProgram: filteredProgram ?? [],
              filter: filter,
              statusChild: childRegisterData ?? [],
            },
          }}
          handler={{
            setFilter: setFilter,
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
