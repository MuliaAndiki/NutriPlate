import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";
import { IotDeviceResponse } from "@/types/res";
import { FormRegisterDevice, FormSendCommand } from "@/types/form";

class IotApi {
  public async getDevices(): Promise<TResponse<IotDeviceResponse[]>> {
    const res = await AxiosClient.get("/api/iot/devices");
    return res.data;
  }

  public async getAllDevices(): Promise<
    TResponse<{ success: boolean; data: IotDeviceResponse[] }>
  > {
    const res = await AxiosClient.get("/api/iot/device/all");
    return res.data;
  }

  public async getDeviceDetail(
    token: string,
  ): Promise<TResponse<IotDeviceResponse>> {
    const res = await AxiosClient.get(`/api/iot/device/${token}`);
    return res.data;
  }

  public async sendCommand(payload: FormSendCommand): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/iot/command/send", payload);
    return res.data;
  }

  public async registerDevice(
    payload: FormRegisterDevice,
  ): Promise<TResponse<IotDeviceResponse>> {
    const res = await AxiosClient.post("/api/iot/register", payload);
    return res.data;
  }

  public async updateDevice(
    token: string,
    payload: {
      deviceName?: string;
      parentId?: string | null;
      posyanduId?: string | null;
      pairingToken?: string | null;
      batteryLevel?: number | null;
      firmwareVersion?: string | null;
      ipAddress?: string | null;
    },
  ): Promise<TResponse<IotDeviceResponse>> {
    const res = await AxiosClient.put(`/api/iot/device/${token}`, payload);
    return res.data;
  }

  public async deleteDevice(token: string): Promise<TResponse<null>> {
    const res = await AxiosClient.delete(`/api/iot/device/${token}`);
    return res.data;
  }
}

export default IotApi;
