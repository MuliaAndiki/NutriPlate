import { INotification } from "../schema/notafication.schema";

export type FormCreateNotification = Pick<
  INotification,
  "title" | "message" | "type"
>;
export type FormNotifyType = Pick<INotification, "type">;
