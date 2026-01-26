"use client";

import ProgresDetailSection from "@/components/section/private/parent/program/progres/detail/detail-progres.section";
import FoodCamera from "@/components/card/food/food-camera";
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

  const [cameraOpen, setCameraOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

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
  const createFoodMutation = service.foodIntake.mutation.createFoodIntake();
  const markTaskDoneMutation = service.task.mutation.doneTask();

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

  const handleOpenCameraForTask = (taskId: string) => {
    const task = taskData.find((t: any) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setCameraOpen(true);
    }
  };

  const handleClosCamera = () => {
    setCameraOpen(false);
    setSelectedTask(null);
  };

  const handlePhotoCapture = async (photoBlob: Blob, weight: number) => {
    if (!id || !selectedTask) return;

    try {
      await createFoodMutation.mutateAsync({
        photoBlob,
        childId: id,
        totalWeightGram: weight,
      });

      await markTaskDoneMutation.mutateAsync(selectedTask.id);

      namespace.alert.toast({
        title: "Sukses!",
        message: "Task selesai dan makanan ditambahkan",
        icon: "success",
      });

      handleClosCamera();
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.byProgresId(progresId),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.foodIntake.list(),
      });
    } catch (error) {
      namespace.alert.toast({
        title: "Error",
        message: error instanceof Error ? error.message : "Gagal",
        icon: "error",
      });
    }
  };

  if (cameraOpen && selectedTask) {
    return (
      <SidebarLayout>
        <FoodCamera
          flowType="task"
          taskName={selectedTask.title}
          onCancel={handleClosCamera}
          onCapture={handlePhotoCapture}
          isLoading={
            createFoodMutation.isPending || markTaskDoneMutation.isPending
          }
        />
      </SidebarLayout>
    );
  }

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
          actions={{
            onOpenCameraForTask: handleOpenCameraForTask,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresDetailContainer;
