import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class ModelsApi {
  public async postModelsVersion(payload: any): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/models", payload);
    return res.data;
  }

  public async getModels(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/models");
    return res.data;
  }
}

export default ModelsApi;
