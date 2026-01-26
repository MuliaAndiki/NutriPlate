import { useGetChildrenInPosyandu, useGetPosyandu } from "./state/query";

export function usePosyandu() {
  return {
    mutation: {
      //
    },
    query: {
      getPosyandu: useGetPosyandu,
      getChildren: useGetChildrenInPosyandu,
    },
  };
}
