import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

// All By User
export function useGetNotification() {
  return useQuery({
    queryKey: cacheKey.notification.byUser(),
    queryFn: () => Api.Notification.getNotafications(),
    staleTime: 1000 * 60 * 5,
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
