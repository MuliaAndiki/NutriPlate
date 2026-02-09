import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormActiveAccount } from "@/types/form/auth.form";
import { FormCreatePosyandu } from "@/types/form/posyandu.form";
import { useMutation } from "@tanstack/react-query";

export function useCreatePosyandu() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormCreatePosyandu>({
    mutationFn: (payload) => Api.Posyandu.createPosyandu(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.posyandu.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully create posyandu",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed create posyandu",
        icon: "error",
      });
    },
  });
}

export function useUpdatePosyandu() {
  const nameSpace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormCreatePosyandu; id: string }
  >({
    mutationFn: ({ payload, id }) => Api.Posyandu.updatePosyandu(payload, id),
    onSuccess: (_res, { id }) => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.posyandu.byId(id),
      });
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.posyandu.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully update posyandu",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed update posyandu",
        icon: "error",
      });
    },
  });
}

export function useDeletePosyandu() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, string>({
    mutationFn: (id) => Api.Posyandu.deletePosyandu(id),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.posyandu.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully delete posyandu",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed delete posyandu",
        icon: "error",
      });
    },
  });
}

export function useActivePosyanduAccount() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormActiveAccount>({
    mutationFn: (payload) => Api.Posyandu.activeAccount(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.posyandu.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully activate posyandu account",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed activate posyandu account",
        icon: "error",
      });
    },
  });
}
