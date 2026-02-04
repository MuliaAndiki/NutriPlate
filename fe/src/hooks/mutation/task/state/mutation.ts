import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateTask } from "@/types/form";
import { useMutation } from "@tanstack/react-query";

export function useDoneTask() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, string>({
    mutationFn: (id) => Api.Task.doneTask(id),
    onSuccess: () => {
      // invalid key
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

export function useCreateTask() {
  const namespace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { id: string; payload: FormCreateTask }
  >({
    mutationFn: ({ id, payload }) => Api.Task.createTask(payload, id),
    onSuccess: () => {
      //invalid key
      namespace.alert.toast({
        title: "berhasil ",
        message: "kamu membuat task untuk anak ini",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "gagal ",
        message: "kamu gagal membuat task untuk anak",
        icon: "error",
      });
    },
  });
}

export function useDeleteTask() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, string>({
    mutationFn: (id) => Api.Task.deleteTask(id),
    onSuccess: () => {
      // invalid key
      namespace.alert.toast({
        title: "berhasil ",
        message: "kamu delete task untuk anak ini",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "gagal ",
        message: "kamu gagal delete task untuk anak",
        icon: "error",
      });
    },
  });
}
