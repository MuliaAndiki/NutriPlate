import {
  useAcceptedKader,
  useRegisterKader,
  useRejectKader,
} from "./state/mutation";
import {
  useGetAcceptedRegister,
  useGetMyRegister,
  useGetPendingRegister,
  useGetRejectRegister,
} from "./state/query";

export function useKaderRegistration() {
  return {
    mutation: {
      registerKader: useRegisterKader,
      acceptedKader: useAcceptedKader,
      rejectedKader: useRejectKader,
    },
    query: {
      getMyRegister: useGetMyRegister,
      getPendingRegister: useGetPendingRegister,
      getAcceptedRegister: useGetAcceptedRegister,
      getRejectRegister: useGetRejectRegister,
    },
  };
}
