import { NotifType } from "../partial";
export interface INotification {
  id: string;
  userID: string;
  type: NotifType | any;
  title: string;
  message: string;
  isRead: boolean;
  isBroadcast: boolean;
  createdAt: string;
}
