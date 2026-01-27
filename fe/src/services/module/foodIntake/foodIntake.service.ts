import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { AnalyzeImageResponse } from "@/types/res/food.respone";
import AxiosClient from "@/utils/axios.client";

class FoodIntakeApi {
  public async createFoodIntake(payload: FormData): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/food/intake", payload);
    return res.data;
  }

  public async analyzeImage(payload: FormData): Promise<AnalyzeImageResponse> {
    const res = await AxiosClient.post("/api/food/analyze", payload);
    return res.data;
  }

  public async getHistoryFood(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/food/history");
    return res.data;
  }

  public async getHistoryFoodByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/food/history/${id}`);
    return res.data;
  }
}

export default FoodIntakeApi;
