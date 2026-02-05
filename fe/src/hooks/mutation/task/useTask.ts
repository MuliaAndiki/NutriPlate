import { useGetTask, useGetTaskNoBroadcast } from "./state/query";
import {
  useCreateTask,
  useDeleteTask,
  useDoneTask,
  useUpdateTask,
} from "./state/mutation";

export function useTask() {
  return {
    mutation: {
      doneTask: useDoneTask,
      createTask: useCreateTask,
      deleteTask: useDeleteTask,
      updateTask: useUpdateTask,
    },
    query: {
      getTask: useGetTask,
      getTaskNoBroadCast: useGetTaskNoBroadcast,
    },
  };
}
