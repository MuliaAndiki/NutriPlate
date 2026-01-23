import { NotifTypeInterface } from "../partial";

export interface NotificationDetailResponse {
  id: string;
  userId: string;
  type: NotifTypeInterface;
  title: string;
  message: string;
  isRead: boolean;
  isBroadcast: boolean;
  createdAt: string;
}

export interface CreateNotificationResponse {
  status: number;
  message: string;
  data: NotificationDetailResponse;
}

export interface GetNotificationsResponse {
  status: number;
  message: string;
  data: NotificationDetailResponse[];
}

export interface GetNotificationByIDResponse {
  status: number;
  message: string;
  data: NotificationDetailResponse;
}

export interface UpdateNotificationResponse {
  status: number;
  message: string;
  data: NotificationDetailResponse;
}

export interface DeleteNotificationResponse {
  status: number;
  message: string;
}

export interface BroadcastNotificationsResponse {
  status: number;
  message: string;
  data?: NotificationDetailResponse;
}
