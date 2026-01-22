import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class IotApi {
  public async rebootIot(payload: any): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/reboot", payload);
    return res.data;
  }
}

export default IotApi;
