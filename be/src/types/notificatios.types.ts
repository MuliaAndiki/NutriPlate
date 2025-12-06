import { NotifType } from "@prisma/client";

export interface INotification {
  id: string;
  userID: string;
  type: NotifType;
  title: string;
  message: string;
}
