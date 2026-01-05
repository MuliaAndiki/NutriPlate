import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormcreateMeasurement } from "@/types/form/measurement.type";
import AxiosClient from "@/utils/axios.client";

class MeasurementApi {
  public async createMeasurementChild(
    payload: FormcreateMeasurement
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/measurement/create", payload);
    return res.data;
  }
  public async getEvaluation(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/measurement/evaluation/${id}`);
    return res.data;
  }
  public async getMeasurement(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/measurement/${id}`);
    return res.data;
  }
}

export default MeasurementApi;
