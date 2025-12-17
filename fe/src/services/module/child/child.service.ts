import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormCreateChild } from "@/types/form/child.form";
import AxiosClient from "@/utils/axios.client";

class ChildApi {
  public async createChild(
    payload: FormCreateChild,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/child/${id}`, payload);
    return res.data;
  }
  public async updateChild(
    payload: FormCreateChild,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/child/${id}`, payload);
    return res.data;
  }
  public async deleteChild(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/child/${id}`);
    return res.data;
  }
}

export default ChildApi;
