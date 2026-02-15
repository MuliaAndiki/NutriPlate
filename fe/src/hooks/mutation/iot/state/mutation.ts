import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { useMutation } from "@tanstack/react-query";

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
