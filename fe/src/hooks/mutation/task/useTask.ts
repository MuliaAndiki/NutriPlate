import { useGetTask, useGetTaskNoBroadcast } from "./state/query";
import { useCreateTask, useDeleteTask, useDoneTask } from "./state/mutation";

export function useTask() {
  return {
    mutation: {
      doneTask: useDoneTask,
      createTask: useCreateTask,
      deleteTask: useDeleteTask,
    },
    query: {
      getTask: useGetTask,
      getTaskNoBroadCast: useGetTaskNoBroadcast,
    },
  };
}
