import {
  useGetNotification,
  useGetNotificationByID,
  useIsNotificationRead,
} from "./state/query";
import {
  useBroadcastNotification,
  useCreateNotification,
  useDeleteNotification,
  useMarkNotificationAsRead,
  useUpdateNotification,
} from "./state/mutation";

export function useNotification() {
  return {
    mutation: {
      markAsRead: useMarkNotificationAsRead,
      create: useCreateNotification,
      update: useUpdateNotification,
      delete: useDeleteNotification,
      broadcast: useBroadcastNotification,
    },
    query: {
      getNotification: useGetNotification,
      getNotificationByID: useGetNotificationByID,
      isNotificationRead: useIsNotificationRead,
    },
  };
}
