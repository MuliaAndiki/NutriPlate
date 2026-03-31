import {
  useCancelStart,
  useConfirmWeight,
  useHoldWeightScale,
  useDeleteIotDevice,
  useRegisterIotDevice,
  useRebootIot,
  useRejectWeight,
  useStartScale,
  useTareScale,
  useUpdateIotDevice,
} from "./state/mutation";
import {
  useGetAllIotDevices,
  useGetIotDeviceDetail,
  useGetIotDevices,
} from "./state/query";

export function useIot() {
  return {
    mutation: {
      startScale: useStartScale,
      tareMode: useTareScale,
      HoldWeight: useHoldWeightScale,
      cancelStart: useCancelStart,
      rejectWeight: useRejectWeight,
      confirmWeight: useConfirmWeight,
      rebootIot: useRebootIot,
      registerDevice: useRegisterIotDevice,
      updateDevice: useUpdateIotDevice,
      deleteDevice: useDeleteIotDevice,
    },
    query: {
      getDevices: useGetIotDevices,
      getAllDevices: useGetAllIotDevices,
      getDeviceDetail: useGetIotDeviceDetail,
    },
  };
}
