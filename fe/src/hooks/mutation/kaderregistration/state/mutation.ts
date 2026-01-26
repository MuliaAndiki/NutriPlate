import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormRegisterAsKader } from "@/types/form";
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
        message: "try againt",
        icon: "error",
      });
    },
  });
}
