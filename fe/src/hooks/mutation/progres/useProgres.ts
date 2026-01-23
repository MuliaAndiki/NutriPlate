import { useCancelProgram } from "./state/mutation";
import { useGetChildInProgram, useGetChildInProgramsById } from "./state/query";

export function useProgres() {
  return {
    mutation: {
      cancelProgram: useCancelProgram,
    },
    query: {
      progresInChildByID: useGetChildInProgramsById,
      progresInChild: useGetChildInProgram,
    },
  };
}
