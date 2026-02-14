import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import {
  FormAssignProgram,
  FormCancelProgram,
} from "@/types/form/progres.form";
import AxiosClient from "@/utils/axios.client";

class ProgresApi {
  // Bulk assign children to program (POSYANDU only)
  public async assingProgramChild(
    payload: FormAssignProgram,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/progres", payload);
    return res.data;
  }

  public async getChildInProgram(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/progres/program/${id}`);
    return res.data;
  }

  public async cancelChildProgram(
    id: string,
    payload: FormCancelProgram,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.patch(`/api/progres/${id}`, payload);
    return res.data;
  }

  public async getHistoryChildProgram(): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/progres/history`);
    return res.data;
  }

  public async getChildInProgramById(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/progres/${id}`);
    return res.data;
  }
}

export default ProgresApi;
