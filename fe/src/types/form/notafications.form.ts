import { INotification } from "../schema/notification.schema";

export type FormCreateNotification = Pick<
  INotification,
  "userId" | "title" | "message" | "type"
>;

export type FormMarkAsRead = Pick<INotification, "id">;

export type FormDeleteNotification = Pick<INotification, "id">;
