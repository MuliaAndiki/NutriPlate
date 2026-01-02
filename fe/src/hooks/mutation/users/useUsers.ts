import { useGetChild, useGetChildById } from "./state/query";

export function useUsers() {
  return {
    mutation: {
      //
    },
    query: {
      childAll: useGetChild,
      childById: useGetChildById,
    },
  };
}
