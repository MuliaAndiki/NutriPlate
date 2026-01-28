import { useRegisterKader } from "./state/mutation";
import { useGetMyRegister } from "./state/query";

export function useKaderRegistration() {
  return {
    mutation: {
      registerKader: useRegisterKader,
    },
    query: {
      getMyRegister: useGetMyRegister,
    },
  };
}
