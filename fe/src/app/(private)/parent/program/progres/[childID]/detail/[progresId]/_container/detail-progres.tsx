"use client";

import ProgresDetailSection from "@/components/section/private/parent/program/progres/detail/detail-progres.section";
import { cacheKey } from "@/configs/cache.config";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
import { useState } from "react";

const ProgresDetailContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { childID, progresId } = useParams<{
    childID: string;
    progresId: string;
  }>();

  //state
  const [taskId, setTaskId] = useState<string | null>(null);

  //progres
  const progresInChildDataByIdQuery =
    service.progres.query.progresInChildByID(childID);
  const progresInChildDataById = progresInChildDataByIdQuery.data?.data ?? null;

  //task
  const taskQuery = service.task.query.getTask(progresId);
  const taskData = taskQuery.data?.data ?? [];

  // mutation
  const cancelProgramMutation = service.progres.mutation.cancelProgram();

  //handler
  const handleCancelProgram = () => {
    if (!childID || !progresInChildDataById?.id) return;

    cancelProgramMutation.mutate(
      {
        payload: {
          id: progresInChildDataById.id,
          childId: childID,
        },
      },
      {
        onSuccess: () => {
          namespace.router.back();
          //key
          namespace.queryClient.invalidateQueries({
            queryKey: cacheKey.child.byID(childID),
          });
        },
      },
    );
  };

  const handleOpenCameraForTask = (taskId: string) => {
    const task = taskData.find((t: any) => t.id === taskId);
    if (task) {
      const params = new URLSearchParams();
      params.set("childId", childID);
      params.set("flowType", "task");
      params.set("taskName", task.title);
      namespace.router.push(`/foodCamera?${params.toString()}`);
    }
  };

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
          actions={{
            onOpenCameraForTask: handleOpenCameraForTask,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresDetailContainer;
