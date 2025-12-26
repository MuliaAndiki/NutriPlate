import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import {
  FormAssingPrograms,
  FormCancelPrograms,
} from "@/types/form/progres.form";
import AxiosClient from "@/utils/axios.client";

class ProgresApi {
  public async assingProgramChild(
    payload: FormAssingPrograms,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/progres", payload);
    return res.data;
  }
  public async getChildInProgram(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/progres");
    return res.data;
  }
  public async cancelChildProgram(
    id: string,
    payload: FormCancelPrograms,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.patch(`/api/progres/${id}`, payload);
    return res.data;
  }
  public async getHistoryChildProgram(): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/progres/history`);
    return res.data;
  }
}

export default ProgresApi;
