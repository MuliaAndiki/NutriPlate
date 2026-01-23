import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormCreateProgram } from "@/types/form/program.form";
import AxiosClient from "@/utils/axios.client";

class ProgramApi {
  public async createProgram(
    payload: FormCreateProgram,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/programs/${id}`, payload);
    return res.data;
  }
  public async updateProgram(
    payload: FormCreateProgram,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/programs/${id}`, payload);
    return res.data;
  }
  public async getPrograms(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/programs");
    return res.data;
  }
  public async getProgrambyID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/programs/${id}`);
    return res.data;
  }
  public async deleteProgram(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/programs/${id}`);
    return res.data;
  }
}

export default ProgramApi;
