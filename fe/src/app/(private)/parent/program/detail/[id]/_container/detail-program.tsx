"use client";
import DetailProgramHeroSection from "@/components/section/private/parent/program/detail/detail-program";
import { cacheKey } from "@/configs/cache.config";
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
  // program
  const programQueryById = service.program.query.getProgramById(id);
  const programDataById = programQueryById.data?.data ?? null;
  // child
  const childQuery = service.user.query.childAll();
  const childData = childQuery.data?.data ?? [];
  const [PopUp, setPopUP] = useState<PopUpNavigate>(null);
  const [idChild, setIdChild] = useState<string | null>(null);

  const registerChildMutation =
    service.programRegistraion.mutation.registerChild();

  const handleRegisterChildInProgram = () => {
    if (!idChild || !id) return null;
    registerChildMutation.mutate(
      {
        childId: idChild,
        programId: id,
      },
      {
        onSuccess: () => {
          namespace.router.back();
          //key
          namespace.queryClient.invalidateQueries({
            queryKey: cacheKey.child.byID(id),
          });
        },
      },
    );
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailProgramHeroSection
          service={{
            query: {
              program: programDataById ?? null,
              isLoading: programQueryById.isLoading || childQuery.isLoading,
              children: childData ?? [],
            },
            mutation: {
              isPending: registerChildMutation.isPending,
              onRegisterChild: handleRegisterChildInProgram,
            },
          }}
          namespace={{
            router: namespace.router,
            pathname: namespace.pathname,
          }}
          state={{
            popUp: PopUp,
            setPopUp: setPopUP,
            idChild: idChild,
            setIdChild: setIdChild,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailProgramContainer;
