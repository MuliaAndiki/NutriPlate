import { useCreateChild } from "./state/mutation";

export function useChild() {
  return {
    mutation: {
      create: useCreateChild,
    },
    query: {
      //
    },
  };
}
