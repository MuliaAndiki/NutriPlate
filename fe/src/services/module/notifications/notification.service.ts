import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormCreateNotification } from "@/types/form/notafications.form";
import AxiosClient from "@/utils/axios.client";
class NotificationApi {
  public async createNotifications(
    payload: FormCreateNotification
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/notifications/", payload);
    return res.data;
  }
  public async getNotaficationsParent(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/notifications/parent");
    return res.data;
  }
  public async getNotaficationsPosyandu(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/notifications/posyandu");
    return res.data;
  }
  public async getNotaficationsKader(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/notifications/kader");
    return res.data;
  }
  public async getNotaficationsByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/notifications/${id}`);
    return res.data;
  }
  //   Admin
  public async getNotatificationsAll(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/notifications/");
    return res.data;
  }
  public async updateNotafications(
    id: string,
    payload: FormCreateNotification
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/notifications/${id}`, payload);
    return res.data;
  }
  public async deleteNotaficatios(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/notifications/${id}`);
    return res.data;
  }
  public async broadcastNotif(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/notifications/broadcast/${id}`);
    return res.data;
  }
}
export default NotificationApi;
