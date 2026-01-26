import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class IotApi {
  public async rebootIot(payload: any): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/reboot", payload);
    return res.data;
  }
  public async statusIot(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/iot/status");
    return res.data;
  }
  public async startScale(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/start-weighing");
    return res.data;
  }
  public async tareScale(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/tare");
    return res.data;
  }
  public async holdWeight(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/hold-weight");
    return res.data;
  }
  public async getWeight(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/iot/weight");
    return res.data;
  }
  public async cancelStart(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/cancel-weighing");
    return res.data;
  }
  public async rejectWeight(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/reject-weight");
    return res.data;
  }
  public async confirmWeight(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/confirm-weight");
    return res.data;
  }
}

export default IotApi;
