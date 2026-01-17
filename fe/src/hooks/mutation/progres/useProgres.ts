import { useCancelProgram } from "./state/mutation";
import { useGetChildInProgramsById } from "./state/query";

export function useProgres() {
  return {
    mutation: {
      cancelProgram: useCancelProgram,
    },
    query: {
      progresInChild: useGetChildInProgramsById,
    },
  };
}
