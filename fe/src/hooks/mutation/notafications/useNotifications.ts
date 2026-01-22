import { useGetNotification } from "./state/query";

export function useNotification() {
  return {
    mutation: {
      //
    },
    query: {
      getNotification: useGetNotification,
    },
  };
}
