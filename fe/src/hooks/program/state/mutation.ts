import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateProgram } from "@/types/form/program.form";
import { useMutation } from "@tanstack/react-query";

export function useCreateProgram() {
  const nameSpace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormCreateProgram; id: string }
  >({
    mutationFn: ({ payload, id }) => Api.Program.createProgram(payload, id),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.program.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully create program",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed create program",
        icon: "error",
      });
    },
  });
}

export function useUpdateProgram() {
  const nameSpace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: Partial<FormCreateProgram>; id: string }
  >({
    mutationFn: ({ payload, id }) => Api.Program.updateProgram(payload, id),
    onSuccess: (_res, { id }) => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.program.byID(id),
      });
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.program.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully update program",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed update program",
        icon: "error",
      });
    },
  });
}

export function useDeleteProgram() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, string>({
    mutationFn: (id) => Api.Program.deleteProgram(id),
    onSuccess: (_res, id) => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.program.byID(id),
      });
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.program.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully delete program",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed delete program",
        icon: "error",
      });
    },
  });
}
