import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class ProxyApi {
  public async getFastApi(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/service");
    return res.data;
  }

  public async getHealth(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/service/health");
    return res.data;
  }

  public async getStatusIot(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/service/status");
    return res.data;
  }
}

export default ProxyApi;
