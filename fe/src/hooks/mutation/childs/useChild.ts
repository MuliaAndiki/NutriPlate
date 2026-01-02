import {
  useCreateChild,
  useDeleteChild,
  useUpdateChild,
} from "./state/mutation";

export function useChild() {
  return {
    mutation: {
      create: useCreateChild,
      update: useUpdateChild,
      delete: useDeleteChild,
    },
    query: {
      //
    },
  };
}
