import { NotifType } from "../partial";
export interface INotification {
  id: string;
  userID: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  isBroadcast: boolean;
}
