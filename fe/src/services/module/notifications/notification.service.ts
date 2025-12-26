import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormCreateNotification } from "@/types/form/notafications.form";
import AxiosClient from "@/utils/axios.client";
class NotificationApi {
  public async createNotifications(
    payload: FormCreateNotification,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/notifications/", payload);
    return res.data;
  }
  public async getNotafications(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/notifications/");
    return res.data;
  }
  public async getNotificationByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/notifications/${id}`);
    return res.data;
  }
  public async updateNotification(
    id: string,
    payload: FormCreateNotification,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/notifications/${id}`, payload);
    return res.data;
  }
  public async deleteNotification(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/notifications/${id}`);
    return res.data;
  }
  public async broadcastNotifications(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.patch(`/api/notifications/broadcast/${id}`);
    return res.data;
  }
}
export default NotificationApi;
