import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class SessionApi {
  public async getSessionCurent(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/session/current");
    return res.data;
  }
  public async getAllSession(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/session/");
    return res.data;
  }
}

export default SessionApi;
