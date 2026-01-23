import { useRegisterChildToProgram } from "./state/mutation";
import { useGetChildStatusInPrograms } from "./state/query";

export function useProgramRegistrasion() {
  return {
    mutation: {
      registerChild: useRegisterChildToProgram,
    },
    query: {
      getMyStatus: useGetChildStatusInPrograms,
    },
  };
}
