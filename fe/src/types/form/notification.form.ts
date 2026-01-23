import { INotification } from "@/types/schema/notification.schema";

export type FormMarkAsRead = Pick<INotification, "id">;

export type FormDeleteNotification = Pick<INotification, "id">;
