import {
  useCreateChild,
  useDeleteChild,
  useRegisterdChildInPosyandu,
  useUpdateChild,
} from "./state/mutation";

export function useChild() {
  return {
    mutation: {
      create: useCreateChild,
      update: useUpdateChild,
      delete: useDeleteChild,
      registerd: useRegisterdChildInPosyandu,
    },
    query: {
      //
    },
  };
}
