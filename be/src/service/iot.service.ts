import { AxiosService } from '@/utils/axios';
import { cleanNaNValues } from '@/utils/cleanValues';

class IotService {
  private IotGate;
  private isAxiosError;
  constructor() {
    const { IotHit, isAxiosError } = AxiosService();
    this.IotGate = IotHit;
    this.isAxiosError = isAxiosError;
  }
  public async RebootIot() {
    try {
      const res = await this.IotGate.post('/reset');
      let result = res.data;
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }

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
