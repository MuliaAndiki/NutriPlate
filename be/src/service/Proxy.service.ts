import { AxiosService } from '@/utils/axios';
import { cleanNaNValues } from '@/utils/cleanValues';
import { AppContext } from '@/contex/appContex';

class Proxy {
  private MlGate;
  private IotGate;
  private isAxiosError;
  constructor() {
    const { MlHit, IotHit, isAxiosError } = AxiosService();
    this.MlGate = MlHit;
    this.IotGate = IotHit;
    this.isAxiosError = isAxiosError;
  }
  public async getFastApi() {
    try {
      const res = await this.MlGate.get('/');
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      const clean = cleanNaNValues(result);
      return clean;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Ml Service UNAVAILABLE');
      }
      throw error;
    }
  }
  public async getHealth() {
    try {
      const res = await this.MlGate.get('/health');
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      const clean = cleanNaNValues(result);
      return clean;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Ml Service UNAVAILABLE');
      }
      throw error;
    }
  }

  public async getStatusIot() {
    try {
      const res = await this.IotGate.get('/status');
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      const clean = cleanNaNValues(result);
      return clean;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'IOT Service UNAVAILABLE');
      }
      throw error;
    }
  }
}

export default new Proxy();
