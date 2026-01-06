import { useGetChild, useGetChildById, useGetProfile } from "./state/query";

export function useUsers() {
  return {
    mutation: {
      //
    },
    query: {
      childAll: useGetChild,
      childById: useGetChildById,
      profile: useGetProfile,
    },
  };
}
