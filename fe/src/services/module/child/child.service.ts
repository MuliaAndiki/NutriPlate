import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import {
  FormCreateChild,
  FormRegisteredChild,
  PickChilID,
} from "@/types/form/child.form";
import AxiosClient from "@/utils/axios.client";

class ChildApi {
  // intergrate
  public async createChild(payload: FormCreateChild): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/child/`, payload);
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
  public async registerChild(
    payload: FormRegisteredChild,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.patch(`/api/child/${id}`, payload);
    return res.data;
  }
  public async cancelChild(
    payload: PickChilID,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.patch(`/api/child/cancel/${id}`, payload);
    return res.data;
  }
}

export default ChildApi;
