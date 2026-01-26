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
  public async getStatusIot() {
    try {
      const res = await this.IotGate.get('/status');
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
  public async StartScale() {
    try {
      const res = await this.IotGate.post('/start-weighing');
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
  public async TareModeScale() {
    try {
      const res = await this.IotGate.post('/tare');
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
  public async HoldWeight() {
    try {
      const res = await this.IotGate.post('/hold-weight');
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
  public async GetWeight() {
    try {
      const res = await this.IotGate.get('/weight');
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
  public async CancelStart() {
    try {
      const res = await this.IotGate.post('/cancel-weighing');
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
  public async RejectWeight() {
    try {
      const res = await this.IotGate.post('/reject-weight');
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
  public async ConfirmWeight() {
    try {
      const res = await this.IotGate.post('/confirm-weight');
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
