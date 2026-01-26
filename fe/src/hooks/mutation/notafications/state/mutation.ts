import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/props.module";
import { cacheKey } from "@/configs/cache.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

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
