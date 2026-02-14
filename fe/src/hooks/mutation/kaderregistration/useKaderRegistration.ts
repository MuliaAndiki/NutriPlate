import {
  useAcceptedKader,
  useDeleteKaderInPosyandu,
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
      deleteKader: useDeleteKaderInPosyandu,
    },
    query: {
      getMyRegister: useGetMyRegister,
      getPendingRegister: useGetPendingRegister,
      getAcceptedRegister: useGetAcceptedRegister,
      getRejectRegister: useGetRejectRegister,
    },
  };
}
