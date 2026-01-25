import { useGetTask } from "./state/query";

export function useTask() {
  return {
    mutation: {
      //
    },
    query: {
      getTask: useGetTask,
    },
  };
}
