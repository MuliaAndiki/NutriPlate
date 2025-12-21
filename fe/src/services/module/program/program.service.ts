import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormCreateProgram } from "@/types/form/program.form";
import AxiosClient from "@/utils/axios.client";

class ProgramApi {
  public async create(
    payload: FormCreateProgram,
    id: string
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/programs/${id}`, payload);
    return res.data;
  }
  public async update(
    payload: FormCreateProgram,
    id: string
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/programs/${id}`, payload);
    return res.data;
  }
  public async get(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/programs");
    return res.data;
  }
  public async getByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/programs/${id}`);
    return res.data;
  }
  public async delete(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/programs${id}`);
    return res.data;
  }
}

export default ProgramApi;
