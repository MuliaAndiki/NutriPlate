import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { useMutation } from "@tanstack/react-query";

export function usePostModelsVersion() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: (payload) => Api.Models.postModelsVersion(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.models.list(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully update models",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed update models",
        icon: "error",
      });
    },
  });
}
