import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateChild } from "@/types/form/child.form";
import { useMutation } from "@tanstack/react-query";

export function useCreateChild() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormCreateChild>({
    mutationFn: (payload) => Api.Child.createChild(payload),
    onSuccess: () => {
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
