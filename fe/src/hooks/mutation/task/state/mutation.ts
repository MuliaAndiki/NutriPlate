import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateTask } from "@/types/form";
import { useMutation } from "@tanstack/react-query";

export function useDoneTask() {
  const namespace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    string | { id: string; progresId?: string }
  >({
    mutationFn: (payload) =>
      Api.Task.doneTask(typeof payload === "string" ? payload : payload.id),
    onSuccess: (_res, payload) => {
      const progresId =
        typeof payload === "string" ? undefined : payload.progresId;
      if (progresId) {
        namespace.queryClient.invalidateQueries({
          queryKey: cacheKey.task.byProgresId(progresId),
        });
      }
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.notBroadcast(),
      });
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
    onSuccess: (_res, { id }) => {
      namespace.alert.toast({
        title: "berhasil ",
        message: "kamu membuat task untuk anak ini",
        icon: "success",
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.byProgresId(id),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.notBroadcast(),
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
    onSuccess: (_res, id) => {
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.notBroadcast(),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.byProgresId(id),
      });
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

export function useUpdateTask() {
  const namespace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormCreateTask; id: string }
  >({
    mutationFn: ({ id, payload }) => Api.Task.updateTask(id, payload),
    onSuccess: (_res, { id }) => {
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.notBroadcast(),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.byProgresId(id),
      });
      namespace.alert.toast({
        title: "berhasil ",
        message: "kamu update task untuk anak ini",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "gagal ",
        message: "kamu gagal update task untuk anak",
        icon: "error",
      });
    },
  });
}

export function useBroadcastTask() {
  const namespace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: (payload) => Api.Task.broadcastTasks(payload),
    onSuccess: () => {
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.task.notBroadcast(),
      });
      namespace.alert.toast({
        title: "berhasil ",
        message: "kamu broadcast task",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      namespace.alert.toast({
        title: "gagal ",
        message: "kamu gagal broadcast task",
        icon: "error",
      });
    },
  });
}
