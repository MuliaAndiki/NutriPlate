"use client";

import ProgresDetailSection from "@/components/section/private/parent/program/progres/detail/detail-progres.section";
import { cacheKey } from "@/configs/cache.config";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
const ProgresDetailContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { id, progresId } = useParams<{ id: string; progresId: string }>();
  //progres
  const progresInChildDataByIdQuery =
    service.progres.query.progresInChildByID(id);
  const progresInChildDataById = progresInChildDataByIdQuery.data?.data ?? null;

  const cancelProgramMutation = service.progres.mutation.cancelProgram();

  const handleCancelProgram = () => {
    if (!id || !progresInChildDataById?.id) return;

    cancelProgramMutation.mutate(
      {
        payload: {
          id: progresInChildDataById.id,
          childId: id,
        },
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
      <main className="w-full">
        <ProgresDetailSection
          namespace={{
            router: namespace.router,
            pathname:namespace.pathname
          }}
          service={{
            mutation: {
              isPending: cancelProgramMutation.isPending,
              onCancelPropgram: handleCancelProgram,
            },
            query: {
              progres: progresInChildDataById ?? null,
              isLoading: progresInChildDataByIdQuery.isLoading,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresDetailContainer;
