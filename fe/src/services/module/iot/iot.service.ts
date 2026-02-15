import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";
import { IotDeviceResponse } from "@/types/res";

class IotApi {
  public async getDevices(): Promise<TResponse<IotDeviceResponse[]>> {
    const res = await AxiosClient.get("/api/iot/devices");
    return res.data;
  }

  public async getDeviceDetail(
    token: string,
  ): Promise<TResponse<IotDeviceResponse>> {
    const res = await AxiosClient.get(`/api/iot/device/${token}`);
    return res.data;
  }

  public async sendCommand(payload: {
    token: string;
    command: string;
  }): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/command/send", payload);
    return res.data;
  }

  public async registerDevice(payload: {
    token: string;
    name: string;
    parentId?: string;
    posyanduId?: string;
    pairingToken?: string;
  }): Promise<TResponse<IotDeviceResponse>> {
    const res = await AxiosClient.post("/api/iot/register", payload);
    return res.data;
  }
}

export default IotApi;
