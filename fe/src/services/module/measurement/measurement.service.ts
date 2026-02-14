import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormCreateMeasurement } from "@/types/form";
import AxiosClient from "@/utils/axios.client";

class MeasurementApi {
  // Posyandu
  public async createMeasurementChild(
    payload: FormCreateMeasurement,
    id: string,
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
  public async updateMeasuremntController(
    payload: FormCreateMeasurement,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/measurement/${id}`, payload);
    return res.data;
  }
  public async getAllMeasuremnt(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/measurement/all/${id}`);
    return res.data;
  }
}

export default MeasurementApi;
