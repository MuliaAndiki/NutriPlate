import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormActiveAccount } from "@/types/form/auth.form";
import { FormCreatePosyandu } from "@/types/form/posyandu.form";
import AxiosClient from "@/utils/axios.client";

class PosyanduApi {
  public async createPosyandu(
    payload: FormCreatePosyandu
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/posyandu/`, payload);
    return res.data;
  }
  public async getPosyandu(): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/posyandu/`);
    return res.data;
  }
  public async getPosyanduByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/posyandu/${id}`);
    return res.data;
  }
  public async activePosyandu(
    payload: FormActiveAccount
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/posyandu/active", payload);
    return res.data;
  }
  public async updatePosyandu(
    payload: FormCreatePosyandu,
    id: string
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/posyandu/${id}`, payload);
    return res.data;
  }
  public async deletePosyandu(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/posyandu/${id}`);
    return res.data;
  }
  //   warning
  public async getChildPosyandu(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/posyandu/${id}/child`);
    return res.data;
  }
}

export default PosyanduApi;
