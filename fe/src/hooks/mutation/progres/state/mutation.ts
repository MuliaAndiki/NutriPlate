import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCancelPrograms } from "@/types/form/progres.form";
import { useMutation } from "@tanstack/react-query";

export function useCancelProgram() {
  const nameSpace = useAppNameSpace();

  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormCancelPrograms; id: any }
  >({
    mutationFn: ({ payload, id }) =>
      Api.Progres.cancelChildProgram(id, payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully cancel child in program",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "faild",
        message: "failed cancel child in program",
        icon: "error",
      });
    },
  });
}
