import {
  useAcceptProgramRegistration,
  useRegisterChildToProgram,
  useRejectProgramRegistration,
} from "./state/mutation";
import { useGetChildStatusInPrograms } from "./state/query";

export function useProgramRegistrasion() {
  return {
    mutation: {
      registerChild: useRegisterChildToProgram,
      acceptRegistration: useAcceptProgramRegistration,
      rejectRegistration: useRejectProgramRegistration,
    },
    query: {
      getMyStatus: useGetChildStatusInPrograms,
    },
  };
}
