import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";
import { FormRegisterDevice } from "@/types/form";

export function useStartScale() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({ token: payload.token, command: "start-weighing" }),
    onSuccess: () => {
      //
    },
    onError: (err) => {
      console.error("Failed to start scale:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal start timbangan ",
        icon: "error",
      });
    },
  });
}

export function useTareScale() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({ token: payload.token, command: "tare" }),
    onSuccess: () => {
      //
    },
    onError: (err) => {
      console.error("Failed to tare Scale:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal start timbangan ",
        icon: "error",
      });
    },
  });
}

export function useHoldWeightScale() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({ token: payload.token, command: "hold-weight" }),
    onSuccess: () => {
      //
    },
    onError: (err) => {
      console.error("Failed holdScale:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal start timbangan ",
        icon: "error",
      });
    },
  });
}

export function useCancelStart() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({
        token: payload.token,
        command: "cancel-weighing",
      }),
    onSuccess: () => {
      //
    },
    onError: (err) => {
      console.error("Failed cancel scale:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal cancel timbangan ",
        icon: "error",
      });
    },
  });
}

export function useRejectWeight() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({ token: payload.token, command: "reject-weight" }),
    onSuccess: () => {
      //
    },
    onError: (err) => {
      console.error("Failed reject weight:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal reject weight ",
        icon: "error",
      });
    },
  });
}

export function useConfirmWeight() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({ token: payload.token, command: "confirm-weight" }),
    onSuccess: () => {
      //
    },
    onError: (err) => {
      console.error("Failed confirm weight:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal confirm weight ",
        icon: "error",
      });
    },
  });
}

export function useRebootIot() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { token: string }>({
    mutationFn: (payload) =>
      Api.Iot.sendCommand({ token: payload.token, command: "reboot" }),
    onSuccess: () => {
      namespace.alert.toast({
        title: "Succes",
        message: "Iot berhasil direboot",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error("Failed reboot iot:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal reboot iot",
        icon: "error",
      });
    },
  });
}

export function useRegisterIotDevice() {
  const namespace = useAppNameSpace();
  const queryClient = useQueryClient();

  return useMutation<TResponse<any>, Error, FormRegisterDevice>({
    mutationFn: (payload) => Api.Iot.registerDevice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey.iot.list() });
      queryClient.invalidateQueries({ queryKey: cacheKey.iot.all() });
      namespace.alert.toast({
        title: "Succes",
        message: "Perangkat berhasil didaftarkan",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error("Failed register iot:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal mendaftarkan perangkat",
        icon: "error",
      });
    },
  });
}

export function useUpdateIotDevice() {
  const namespace = useAppNameSpace();
  const queryClient = useQueryClient();

  return useMutation<
    TResponse<any>,
    Error,
    {
      token: string;
      payload: {
        deviceName?: string;
        parentId?: string | null;
        posyanduId?: string | null;
        pairingToken?: string | null;
        batteryLevel?: number | null;
        firmwareVersion?: string | null;
        ipAddress?: string | null;
      };
    }
  >({
    mutationFn: ({ token, payload }) => Api.Iot.updateDevice(token, payload),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: cacheKey.iot.list() });
      queryClient.invalidateQueries({ queryKey: cacheKey.iot.all() });
      queryClient.invalidateQueries({
        queryKey: cacheKey.iot.device(variables.token),
      });
      namespace.alert.toast({
        title: "Succes",
        message: "Perangkat berhasil diperbarui",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error("Failed update iot:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal memperbarui perangkat",
        icon: "error",
      });
    },
  });
}

export function useDeleteIotDevice() {
  const namespace = useAppNameSpace();
  const queryClient = useQueryClient();

  return useMutation<TResponse<null>, Error, { token: string }>({
    mutationFn: ({ token }) => Api.Iot.deleteDevice(token),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: cacheKey.iot.list() });
      queryClient.invalidateQueries({ queryKey: cacheKey.iot.all() });
      queryClient.removeQueries({
        queryKey: cacheKey.iot.device(variables.token),
      });
      namespace.alert.toast({
        title: "Succes",
        message: "Perangkat berhasil dihapus",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error("Failed delete iot:", err);
      namespace.alert.toast({
        title: "Error",
        message: "Gagal menghapus perangkat",
        icon: "error",
      });
    },
  });
}
