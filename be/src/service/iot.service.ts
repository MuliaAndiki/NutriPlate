import { AxiosService } from '@/utils/axios';
import { cleanNaNValues } from '@/utils/cleanValues';
import { env } from '@/config/env.config';

type VpsDevicePayload = {
  token?: string;
  name?: string;
  weight?: number;
  stable_weight?: number;
  status?: string;
  ip?: string;
  online?: boolean;
  cal_factor?: number;
  state?: number;
  state_description?: string;
  last_seen?: string;
};

class IotService {
  private IotGate;
  private isAxiosError;
  constructor() {
    const { IotHit, isAxiosError } = AxiosService();
    this.IotGate = IotHit;
    this.isAxiosError = isAxiosError;
  }
  private getDeviceToken() {
    const token = env.DEFAULT_DEVICE_TOKEN;
    if (!token) {
      throw new Error('DEFAULT_DEVICE_TOKEN belum diset.');
    }
    return token;
  }
  private normalizeDevice(payload: any, fallbackToken: string) {
    const device: VpsDevicePayload | null =
      payload?.device ?? payload?.data ?? payload ?? null;
    if (!device) return null;

    const online = device.online ?? true;
    const status = online ? device.status ?? 'ready' : 'offline';

    return cleanNaNValues({
      id: device.token ?? fallbackToken,
      name: device.name ?? 'Nutriplate',
      status,
      weight: device.weight ?? 0,
      stable_weight: device.stable_weight ?? 0,
      cal_factor: device.cal_factor ?? 0,
      state: device.state ?? 0,
      ip: device.ip ?? 'unknown',
      state_description: device.state_description ?? status,
      last_seen: device.last_seen ?? null,
      online,
    });
  }
  private async sendCommand(command: string, params?: any) {
    const token = this.getDeviceToken();
    const res = await this.IotGate.post(`/api/client/command/${token}`, {
      command,
      params: params ?? {},
    });
    return res.data;
  }
  public async RebootIot() {
    try {
      const result = await this.sendCommand('reset');
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async getStatusIot() {
    try {
      const token = this.getDeviceToken();
      const res = await this.IotGate.get(`/api/client/status/${token}`, {
        timeout: 3000,
      });
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      return this.normalizeDevice(result, token);
    } catch (error) {
      return null;
    }
  }
  public async StartScale() {
    try {
      const result = await this.sendCommand('start-weighing');
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async TareModeScale() {
    try {
      const result = await this.sendCommand('tare');
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async HoldWeight() {
    try {
      const result = await this.sendCommand('hold-weight');
      const status = await this.getStatusIot();
      const cleanRespone = cleanNaNValues({
        ...result,
        weight: status?.stable_weight ?? status?.weight ?? null,
      });
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async GetWeight() {
    try {
      const status = await this.getStatusIot();
      return cleanNaNValues({
        weight: status?.weight ?? null,
      });
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async CancelStart() {
    try {
      const result = await this.sendCommand('cancel-weighing');
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async RejectWeight() {
    try {
      const result = await this.sendCommand('reject-weight');
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async ConfirmWeight() {
    try {
      const result = await this.sendCommand('confirm-weight');
      const status = await this.getStatusIot();
      const cleanRespone = cleanNaNValues({
        ...result,
        weight: status?.stable_weight ?? status?.weight ?? null,
      });
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
  public async resetPassword() {
    try {
      const result = await this.sendCommand('reset');
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Iot Not Working');
      }
      throw error;
    }
  }
}

export default new IotService();
