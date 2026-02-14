"use client";

import TaskKaderSection from "@/components/section/private/kader/daftar-program/detail-program/task/task-detail-program-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateTask, FormUpdateTask } from "@/types/form";
import { PopUpNavigate } from "@/types/ui";
import { parsePayload } from "@/utils/parse.format";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TaskPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const { programID, childrenID } = useParams<{
    programID: string;
    childrenID: string;
  }>();
  const service = useService();

  const [popUp, setPopUp] = useState<PopUpNavigate>(null);
  const [formCreateTask, setFormCreateTask] = useState<FormCreateTask>({
    title: "",
    description: "",
    mealType: "",
    targetCarbGram: 0,
    targetEnergyKcal: 0,
    targetFatGram: 0,
    targetFiberGram: 0,
    targetProteinGram: 0,
  });
  const [formUpdateTask, setFormUpdateTask] = useState<FormUpdateTask | null>(
    null,
  );
  const [taskID, setTaksID] = useState<string>("");

  const childByIdQuery = service.user.query.childById(childrenID ?? "");
  const childByIdData = childByIdQuery.data?.data ?? null;

  const taskQuery = service.task.query.getTaskNoBroadCast();
  const taskData = taskQuery.data?.data ?? [];

  const progresQuery = service.progres.query.progresInChildByID(childrenID);
  const progresData = progresQuery.data?.data ?? null;
  const progresID = progresData?.id ?? "";

  const createTaskMutation = service.task.mutation.createTask();
  const deleteTaskMutation = service.task.mutation.deleteTask();
  const updateTaskMutation = service.task.mutation.updateTask();
  const broadcastTaskMutation = service.task.mutation.broadcastTask();

  useEffect(() => {
    if (!taskData || !taskID) return;
    const selectedTask = taskData.find((t: any) => t.id === taskID);
    if (!selectedTask) return;

    setFormUpdateTask({
      id: selectedTask.id,
      title: selectedTask.title,
      description: selectedTask.description,
      mealType: selectedTask.mealType,
      targetCarbGram: selectedTask.targetCarbGram,
      targetEnergyKcal: selectedTask.targetEnergyKcal,
      targetFatGram: selectedTask.targetFatGram,
      targetFiberGram: selectedTask.targetFiberGram,
      targetProteinGram: selectedTask.targetProteinGram,
    });
  }, [taskID, taskData]);

  const handleCreateTask = () => {
    if (!childrenID) return null;
    createTaskMutation.mutate(
      {
        id: progresID,
        payload: formCreateTask,
      },
      {
        onSuccess: () => {
          setPopUp(null);
        },
      },
    );
  };

  const handleDeleteTask = () => {
    if (!taskID) return null;
    deleteTaskMutation.mutate(taskID);
  };

  const handleUpdateTask = () => {
    if (!taskID || !taskData || !formUpdateTask) return null;
    const originalTask = taskData.find((t: any) => t.id === taskID);
    if (!originalTask) return;

    const payload = parsePayload(originalTask, formUpdateTask);

    updateTaskMutation.mutate(
      {
        id: taskID,
        payload: payload as FormUpdateTask,
      },
      {
        onSuccess: () => {
          setPopUp(null);
        },
      },
    );
  };

  const handleBroadcastTask = (id: string) => {
    if (!id) return null;
    broadcastTaskMutation.mutate({ taskIds: [id] });
  };

  return (
    <main className="w-full min-h-screen">
      <TaskKaderSection
        namespace={{
          router: namespace.router,
          alert: namespace.alert,
        }}
        service={{
          query: {
            children: childByIdData ?? null,
            isLoading:
              childByIdQuery.isLoading ||
              taskQuery.isLoading ||
              progresQuery.isLoading,
            task: taskData ?? [],
          },
          mutation: {
            isPending:
              createTaskMutation.isPending || deleteTaskMutation.isPending,
            onCreateTask: handleCreateTask,
            onDelete: handleDeleteTask,
            onUpdateTask: handleUpdateTask,
            onBroadcastTask: handleBroadcastTask,
          },
        }}
        state={{
          popUp: popUp,
          setPopUp: setPopUp,
          formCreateTask: formCreateTask,
          setFormCreateTask: setFormCreateTask,
          setTaskID: setTaksID,
          taskID: taskID,
          formUpdateTask: formUpdateTask,
          setFormUpdateTask: setFormUpdateTask,
        }}
      />
    </main>
  );
};

export default TaskPosyanduContainer;
