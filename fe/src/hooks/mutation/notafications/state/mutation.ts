import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/props.module";
import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateNotification } from "@/types/form/notafications.form";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { alert } = useAppNameSpace();

  return useMutation({
    mutationFn: (notificationId: string) =>
      Api.Notification.markNotificationAsRead(notificationId),
    onSuccess: (data, notificationId) => {
      queryClient.invalidateQueries({
        queryKey: [cacheKey.notification.byId(notificationId), "read-status"],
      });

      queryClient.invalidateQueries({
        queryKey: [cacheKey.notification.byUser("")],
      });
    },
    onError: (error) => {
      console.error("Failed to mark as read:", error);
      alert.toast({
        title: "Error",
        message: "Gagal menandai notifikasi sebagai dibaca",
        icon: "error",
      });
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const { alert } = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: FormCreateNotification) =>
      Api.Notification.createNotifications(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cacheKey.notification.list(),
      });
      alert.toast({
        title: "Succes",
        message: "Notifikasi berhasil dibuat",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Failed to create notification:", error);
      alert.toast({
        title: "Error",
        message: "Gagal membuat notifikasi",
        icon: "error",
      });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  const { alert } = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: { id: string; data: FormCreateNotification }) =>
      Api.Notification.updateNotification(payload.id, payload.data),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: cacheKey.notification.byId(payload.id),
      });
      queryClient.invalidateQueries({
        queryKey: cacheKey.notification.list(),
      });
      alert.toast({
        title: "Succes",
        message: "Notifikasi berhasil diupdate",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Failed to update notification:", error);
      alert.toast({
        title: "Error",
        message: "Gagal update notifikasi",
        icon: "error",
      });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { alert } = useAppNameSpace();
  return useMutation({
    mutationFn: (id: string) => Api.Notification.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cacheKey.notification.list(),
      });
      alert.toast({
        title: "Succes",
        message: "Notifikasi berhasil dihapus",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
      alert.toast({
        title: "Error",
        message: "Gagal hapus notifikasi",
        icon: "error",
      });
    },
  });
}

export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  const { alert } = useAppNameSpace();
  return useMutation({
    mutationFn: (id: string) => Api.Notification.broadcastNotifications(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cacheKey.notification.list(),
      });
      alert.toast({
        title: "Succes",
        message: "Notifikasi berhasil dibroadcast",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Failed to broadcast notification:", error);
      alert.toast({
        title: "Error",
        message: "Gagal broadcast notifikasi",
        icon: "error",
      });
    },
  });
}
