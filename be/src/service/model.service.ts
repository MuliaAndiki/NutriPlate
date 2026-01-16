import { AxiosService } from '@/utils/axios';
import { cleanNaNValues } from '@/utils/cleanValues';
import { getRedis } from '@/utils/redis';
class MlService {
  private MlGate;
  private isAxiosError;

  constructor() {
    const { MlHit, isAxiosError } = AxiosService();
    this.MlGate = MlHit;
    this.isAxiosError = isAxiosError;
  }
  public async getCurrentModels() {
    try {
      const res = await this.MlGate.get('/models/current');
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Ml Gate Not Working');
      }
      throw error;
    }
  }
  public async PostNewModels() {
    try {
      const res = await this.MlGate.post('/models');
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      const cleanRespone = cleanNaNValues(result);
      return cleanRespone;
    } catch (error) {
      if (this.isAxiosError(error)) {
        throw new Error(error.code || error.message || 'Ml Gate Not Working');
      }
      throw error;
    }
  }
}

export default new MlService();
