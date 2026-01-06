import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormcreateMeasurement } from "@/types/form/measurement.type";
import AxiosClient from "@/utils/axios.client";

class MeasurementApi {
  // Posyandu
  public async createMeasurementChild(
    payload: FormcreateMeasurement,
    id: string
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/measurement/${id}`, payload);
    return res.data;
  }
  public async getGrowth(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/measurement/evaluation/${id}`);
    return res.data;
  }
  public async getMeasurement(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/measurement/${id}`);
    return res.data;
  }
}

export default MeasurementApi;
