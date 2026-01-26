import {
  useCancelStart,
  useConfirmWeight,
  useHoldWeightScale,
  useRejectWeight,
  useStartScale,
  useTareScale,
} from "./state/mutation";
import { useGetIotStatus, useGetWeight } from "./state/query";

export function useIot() {
  return {
    mutation: {
      startScale: useStartScale,
      tareMode: useTareScale,
      HoldWeight: useHoldWeightScale,
      cancelStart: useCancelStart,
      rejectWeight: useRejectWeight,
      confirmWeight: useConfirmWeight,
    },
    query: {
      getStatusIot: useGetIotStatus,
      getWeight: useGetWeight,
    },
  };
}
