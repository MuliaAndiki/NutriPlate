import { useGetCurrent, useGetList } from "./state/query";

export function useSession() {
  return {
    query: {
      getCurrent: useGetCurrent,
      getAll: useGetList,
    },
    mutation: {
      // logic
    },
  };
}
