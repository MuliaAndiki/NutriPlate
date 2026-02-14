export interface INotification {
  id: string;
  userId: string;
  type: "result" | "reminder" | "alert" | "edukasi";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  isBroadcast: boolean;
}
