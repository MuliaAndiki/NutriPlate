"use client";

import TaskKaderSection from "@/components/section/private/kader/daftar-program/detail-program/task/task-detail-program-section";
import { cacheKey } from "@/configs/cache.config";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateTask } from "@/types/form";
import { PopUpNavigate } from "@/types/ui";
import { useParams } from "next/navigation";
import { useState } from "react";

const TaskKaderContainer = () => {
  const namespace = useAppNameSpace();
  const { programID, childID } = useParams<{
    programID: string;
    childID: string;
  }>();
  const service = useService();

  //state
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
  const [taskID, setTaksID] = useState<string>("");

  //child
  const childByIdQuery = service.user.query.childById(childID ?? "");
  const childByIdData = childByIdQuery.data?.data ?? null;

  //task
  const taskQuery = service.task.query.getTaskNoBroadCast();
  const taskData = taskQuery.data?.data ?? [];

  //progres
  const progresQuery = service.progres.query.progresInChildByID(childID);
  const progresData = progresQuery.data?.data ?? null;
  const progresID = progresData?.id ?? "";

  //mutation
  const createTaskMutation = service.task.mutation.createTask();
  const deleteTaskMutation = service.task.mutation.deleteTask();

  //handler
  const handleCreateTask = () => {
    if (!childID) return null;
    createTaskMutation.mutate(
      {
        id: progresID,
        payload: formCreateTask,
      },
      {
        onSuccess: () => {
          setPopUp(null);
          namespace.queryClient.invalidateQueries({
            queryKey: cacheKey.task.notBroadcast(),
          });
        },
      },
    );
  };

  const handleDeleteTask = () => {
    if (!taskID) return null;
    deleteTaskMutation.mutate(taskID, {
      onSuccess: () => {
        // key
      },
    });
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
            isLoading: childByIdQuery.isLoading || taskQuery.isLoading,
            task: taskData ?? [],
          },
          mutation: {
            isPending: createTaskMutation.isPending,
            onCreateTask: handleCreateTask,
            onDelete: handleDeleteTask,
          },
        }}
        state={{
          popUp: popUp,
          setPopUp: setPopUp,
          formCreateTask: formCreateTask,
          setFormCreateTask: setFormCreateTask,
          setTaskID: setTaksID,
          taskID: taskID,
        }}
      />
    </main>
  );
};

export default TaskKaderContainer;
