import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { useMutation } from "@tanstack/react-query";

export function useStartScale() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Iot.startScale(),
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
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Iot.tareScale(),
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
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Iot.holdWeight(),
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
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Iot.cancelStart(),
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
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Iot.rejectWeight(),
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
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Iot.confirmWeight(),
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
