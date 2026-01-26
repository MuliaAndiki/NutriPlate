import { useRegisterKader } from "./state/mutation";

export function useKaderRegistration() {
  return {
    mutation: {
      registerKader: useRegisterKader,
    },
    query: {
      //
    },
  };
}
