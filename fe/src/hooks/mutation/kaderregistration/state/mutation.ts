import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import {
  FormAcceptKaderRegistration,
  FormRegisterAsKader,
  FormRejectKaderRegistration,
} from "@/types/form";
import { useMutation } from "@tanstack/react-query";

export function useRegisterKader() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormRegisterAsKader>({
    mutationFn: (payload) => Api.KaderRegistration.registerToposyandu(payload),
    onSuccess: () => {
      namespace.alert.toast({
        title: "Succes",
        message: "wait for confirmation from posyandu",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "Failed",
        message: "try again",
        icon: "error",
      });
    },
  });
}

export function useAcceptedKader() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormAcceptKaderRegistration>({
    mutationFn: (payload) => Api.KaderRegistration.acceptRegistration(payload),
    onSuccess: () => {
      namespace.alert.toast({
        title: "Succes",
        message: "Kamu Telah Menerima Kader ini Posyandu",
        icon: "success",
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.registrion.pending(),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.posyandu.kaderList(),
      });

      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.registrion.accepted(),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.registrion.reject(),
      });
    },
    onError: () => {
      namespace.alert.toast({
        title: "Failed",
        message: "try again",
        icon: "error",
      });
    },
  });
}

export function useRejectKader() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormRejectKaderRegistration>({
    mutationFn: (payload) => Api.KaderRegistration.rejectRegistration(payload),
    onSuccess: () => {
      namespace.alert.toast({
        title: "Succes",
        message: "Kamu Telah Menolak Kader ini Posyandu",
        icon: "success",
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.registrion.pending(),
      });

      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.registrion.accepted(),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.registrion.reject(),
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "Failed",
        message: "try again",
        icon: "error",
      });
    },
  });
}

export function useDeleteKaderInPosyandu() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, string>({
    mutationFn: (id) => Api.KaderRegistration.deleteKaderInPosyandu(id),
    onSuccess: () => {
      namespace.alert.toast({
        title: "Succes",
        message: "Kamu Telah Menghapus Kader ini di Posyandu",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "Failed",
        message: "try again",
        icon: "error",
      });
    },
  });
}
