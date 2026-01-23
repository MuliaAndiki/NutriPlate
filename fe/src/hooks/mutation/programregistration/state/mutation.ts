import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormRegisterChildToProgram } from "@/types/form";
import { useMutation } from "@tanstack/react-query";

export function useRegisterChildToProgram() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormRegisterChildToProgram>({
    mutationFn: (payload) =>
      Api.ProgramRegistration.registerChildToProgram(payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succesfully",
        message: "succes register child in program",
        icon: "success",
      });
    },
    onError: (err) => {
      nameSpace.alert.toast({
        title: "failed",
        message: "failed register child in program",
        icon: "error",
      });
    },
  });
}
