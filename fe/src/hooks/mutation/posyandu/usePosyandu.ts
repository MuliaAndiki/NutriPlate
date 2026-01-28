import { useGetPosyandu, useGetPosyanduById } from "./state/query";

export function usePosyandu() {
  return {
    mutation: {
      //
    },
    query: {
      getPosyandu: useGetPosyandu,
      getPosyanduById: useGetPosyanduById,
    },
  };
}
