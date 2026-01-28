import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

// All By User
export function useGetNotification(token?: string) {
  return useQuery({
    queryKey: cacheKey.notification.byUser(token!),
    queryFn: () => Api.Notification.getNotafications(),
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });
}

export function useGetNotificationByID(id: string) {
  return useQuery({
    queryKey: cacheKey.notification.byId(id),
    queryFn: () => Api.Notification.getNotificationByID(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useIsNotificationRead(notificationId: string) {
  return useQuery({
    queryKey: [cacheKey.notification.byId(notificationId), "read-status"],
    queryFn: () => Api.Notification.isNotificationRead(notificationId),
    enabled: !!notificationId,
    staleTime: 1000 * 60 * 1,
  });
}
