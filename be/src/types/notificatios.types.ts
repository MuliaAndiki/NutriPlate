import { NotifType } from "@prisma/client";

export interface INotification {
  id: string;
  userID: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  isBroadcast: boolean;
}

export type PickCreateNotification = Pick<
  INotification,
  "title" | "message" | "type"
>;
export type PickNotifyType = Pick<INotification, "type">;
export type PickNotifID = Pick<INotification, "id">;
