import { useAssignProgramChild, useCancelProgram } from "./state/mutation";
import {
  useGetChildInProgram,
  useGetChildInProgramsById,
  useGetHistoryChildProgram,
} from "./state/query";

export function useProgres() {
  return {
    mutation: {
      cancelProgram: useCancelProgram,
      assignProgram: useAssignProgramChild,
    },
    query: {
      progresInChildByID: useGetChildInProgramsById,
      progresInChild: useGetChildInProgram,
      history: useGetHistoryChildProgram,
    },
  };
}
