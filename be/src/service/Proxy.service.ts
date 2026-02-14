import { AxiosService } from '@/utils/axios';
import { cleanNaNValues } from '@/utils/cleanValues';
class Proxy {
  private MlGate;

  private isAxiosError;
  constructor() {
    const { MlHit, isAxiosError } = AxiosService();
    this.MlGate = MlHit;

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
}

export default new Proxy();
