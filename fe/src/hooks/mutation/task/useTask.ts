import { useGetTask, useGetTaskNoBroadcast } from "./state/query";
import {
  useCreateTask,
  useDeleteTask,
  useDoneTask,
  useBroadcastTask,
  useUpdateTask,
} from "./state/mutation";

export function useTask() {
  return {
    mutation: {
      doneTask: useDoneTask,
      createTask: useCreateTask,
      deleteTask: useDeleteTask,
      updateTask: useUpdateTask,
      broadcastTask: useBroadcastTask,
    },
    query: {
      getTask: useGetTask,
      getTaskNoBroadCast: useGetTaskNoBroadcast,
    },
  };
}
