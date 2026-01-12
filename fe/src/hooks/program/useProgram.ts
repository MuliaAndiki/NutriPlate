import { useGetPropgrams, useGetPropgramsByID } from "./state/query";

export function useProgram() {
  return {
    mutation: {
      // initial
    },
    query: {
      getPrograms: useGetPropgrams,
      getProgramById: useGetPropgramsByID,
    },
  };
}
