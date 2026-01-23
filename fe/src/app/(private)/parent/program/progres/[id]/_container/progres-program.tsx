"use client";
import ProgresProgramSection from "@/components/section/private/parent/program/progres/progres-section";
import { cacheKey } from "@/configs/cache.config";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

//SALAH INI SEHARUSNYA LIST PROGRAM YG UDAH DI IKUTI
// ENDPOINT CHILD IN PORGRES ALL

const ProgresProgramContainer = () => {
  const namespace = useAppNameSpace();
  const params = useParams();
  const id = params?.id as string | undefined;

  const service = useService();

  // query
  const childQueryById = service.user.query.childById(id ?? "");
  const childDataById = childQueryById.data?.data ?? null;

  const progresInChildQueryById = service.progres.query.progresInChild(
    id ?? "",
  );
  const progresInChildDataById = progresInChildQueryById.data?.data ?? null;

  // mutation
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
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProgresProgramSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              childType: childDataById ?? null,
              isLoading:
                childQueryById.isLoading || progresInChildQueryById.isLoading,
            },
            mutation: {
              cancelProgram: handleCancelProgram,
              isPending: cancelProgramMutation.isPending,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresProgramContainer;
