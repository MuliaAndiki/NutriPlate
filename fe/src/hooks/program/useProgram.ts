import { useGetPropgrams } from "./state/query";

export function useProgram() {
  return {
    mutation: {
      // initial
    },
    query: {
      getPrograms: useGetPropgrams,
    },
  };
}
