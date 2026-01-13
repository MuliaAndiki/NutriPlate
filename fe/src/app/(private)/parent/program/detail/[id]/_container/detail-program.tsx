"use client";
import DetailProgramHeroSection from "@/components/section/private/parent/program/detail/detail-program";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { PopUpNavigate } from "@/types/ui";
import { useParams } from "next/navigation";
import { useState } from "react";

const DetailProgramContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();
  const programQuery = service.program.query.getProgramById(id);
  const programData = programQuery.data?.data ?? null;
  const [PopUp, setPopUP] = useState<PopUpNavigate>(null);
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailProgramHeroSection
          service={{
            query: {
              program: programData ?? null,
              isLoading: programQuery.isLoading,
            },
          }}
          namespace={{
            router: namespace.router,
          }}
          state={{
            popUp: PopUp,
            setPopUp: setPopUP,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailProgramContainer;
