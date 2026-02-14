import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

class FoodSummaryApi {
  public async getFoodSummaryDaily(childId: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/food/intake/daily/${childId}`);
    return res.data;
  }

  public async getFoodSummaryRange(
    childId: string,
    params?: { startDate?: string; endDate?: string },
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/food/intake/range/${childId}`, {
      params,
    });
    return res.data;
  }
}

export default FoodSummaryApi;
