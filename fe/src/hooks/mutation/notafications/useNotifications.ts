import {
  useGetNotification,
  useGetNotificationByID,
  useIsNotificationRead,
} from "./state/query";
import { useMarkNotificationAsRead } from "./state/mutation";

export function useNotification() {
  return {
    mutation: {
      markAsRead: useMarkNotificationAsRead,
    },
    query: {
      getNotification: useGetNotification,
      getNotificationByID: useGetNotificationByID,
      isNotificationRead: useIsNotificationRead,
    },
  };
}
