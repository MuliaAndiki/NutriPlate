import {
  useGetKaderByPosyandu,
  useGetPosyandu,
  useGetPosyanduById,
} from "./state/query";
import {
  useActivePosyanduAccount,
  useCreatePosyandu,
  useDeletePosyandu,
  useUpdatePosyandu,
} from "./state/mutation";

export function usePosyandu() {
  return {
    mutation: {
      create: useCreatePosyandu,
      update: useUpdatePosyandu,
      delete: useDeletePosyandu,
      activeAccount: useActivePosyanduAccount,
    },
    query: {
      getPosyandu: useGetPosyandu,
      getPosyanduById: useGetPosyanduById,
      getKaderList: useGetKaderByPosyandu,
    },
  };
}
