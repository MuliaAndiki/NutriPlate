import { useGetNotification, useGetNotificationByID } from "./state/query";

export function useNotification() {
  return {
    mutation: {
      //
    },
    query: {
      getNotification: useGetNotification,
      getNotificationByID: useGetNotificationByID,
    },
  };
}
