import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormAssignProgram, FormCancelProgram } from "@/types/form/progres.form";
import { useMutation } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";

export function useCancelProgram() {
  const nameSpace = useAppNameSpace();

  return useMutation<TResponse<any>, Error, { payload: FormCancelProgram }>({
    mutationFn: ({ payload }) =>
      Api.Progres.cancelChildProgram(payload.id, payload),
    onSuccess: (_res, { payload }) => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.progres.byChildList(payload.childId),
      });
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.progres.list(),
      });
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

export function useAssignProgramChild() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormAssignProgram>({
    mutationFn: (payload) => Api.Progres.assingProgramChild(payload),
    onSuccess: (_res, payload) => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.progres.byChildList(payload.childId),
      });
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.progres.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully assign program to child",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed assign program to child",
        icon: "error",
      });
    },
  });
}
