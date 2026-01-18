import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class FoodSummaryApi {
  public async getFoodSummaryDaily(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/food/intake/daily/${id}`);
    return res.data;
  }
}

export default FoodSummaryApi;
