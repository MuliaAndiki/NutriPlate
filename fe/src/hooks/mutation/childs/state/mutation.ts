import { useMutation } from "@tanstack/react-query";

import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateChild, FormRegisteredChild } from "@/types/form/child.form";

export function useCreateChild() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormCreateChild>({
    mutationFn: (payload) => Api.Child.createChild(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.child.list(),
      });
      nameSpace.alert.toast({
        title: "succesfully",
        message: "succes create child",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed create child",
        icon: "error",
      });
    },
  });
}

export function useUpdateChild() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { payload: any; id: string }>({
    mutationFn: ({ payload, id }) => Api.Child.updateChild(payload, id),
    onSuccess: (res) => {
      const id = res.data.id;
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.child.byID(id),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully update Child",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed update child",
        icon: "error",
      });
    },
  });
}

export function useDeleteChild() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, { id: string }>({
    mutationFn: ({ id }) => Api.Child.deleteChild(id),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.child.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully delete child",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed delete child",
        icon: "error",
      });
    },
  });
}

export function useRegisterdChildInPosyandu() {
  const nameSpace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormRegisteredChild; id: string }
  >({
    mutationFn: ({ payload, id }) => Api.Child.registerChild(payload, id),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully registered child in posyandu",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed registered child in posyandu",
        icon: "error",
      });
    },
  });
}
