import { useGetTask } from "./state/query";
import { useDoneTask } from "./state/mutation";

export function useTask() {
  return {
    mutation: {
      doneTask: useDoneTask,
    },
    query: {
      getTask: useGetTask,
    },
  };
}
