import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { useMutation } from "@tanstack/react-query";

export function useDoneTask() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, string>({
    mutationFn: (id) => Api.Task.doneTask(id),
    onSuccess: () => {
      namespace.alert.toast({
        title: "berhasil ",
        message: "kamu menyelesaikan task",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "gagal ",
        message: "kamu gagal menyelesaikan task",
        icon: "error",
      });
    },
  });
}
