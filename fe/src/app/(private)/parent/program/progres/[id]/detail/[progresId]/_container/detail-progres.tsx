"use client";

import ProgresDetailSection from "@/components/section/private/parent/program/progres/detail/detail-progres.section";
import { cacheKey } from "@/configs/cache.config";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useDebugLog } from "@/utils/useDebug";
import { useParams } from "next/navigation";
import { useState } from "react";
const ProgresDetailContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { id, progresId } = useParams<{ id: string; progresId: string }>();
  //progres
  const progresInChildDataByIdQuery =
    service.progres.query.progresInChildByID(id);
  const progresInChildDataById = progresInChildDataByIdQuery.data?.data ?? null;

  //task
  const taskQuery = service.task.query.getTask(progresId);
  const taskData = taskQuery.data?.data ?? [];

  useDebugLog(taskData, [taskQuery], {
    label: "here",
  });

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

  //state
  const [taskId, setTaskId] = useState<string | null>(null);
  return (
    <SidebarLayout>
      <main className="w-full">
        <ProgresDetailSection
          namespace={{
            router: namespace.router,
            pathname: namespace.pathname,
            alert: namespace.alert,
          }}
          service={{
            mutation: {
              isPending: cancelProgramMutation.isPending,
              onCancelPropgram: handleCancelProgram,
            },
            query: {
              progres: progresInChildDataById ?? null,
              isLoading:
                progresInChildDataByIdQuery.isLoading || taskQuery.isLoading,
              task: taskData ?? [],
            },
          }}
          state={{
            setTaskId: setTaskId,
            taskId: taskId,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresDetailContainer;
