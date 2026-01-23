import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import {
  FormRegisterChildToProgram,
  FormAcceptProgramRegistration,
  FormRejectProgramRegistration,
} from "@/types/form/programRegistration.form";
import AxiosClient from "@/utils/axios.client";

class ProgramRegistrationApi {
  public async registerChildToProgram(
    payload: FormRegisterChildToProgram,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(
      "/api/progres/registration/register",
      payload,
    );
    return res.data;
  }

  public async getMyProgramRegistrations(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/progres/registration");
    return res.data;
  }

  public async acceptProgramRegistration(
    payload: FormAcceptProgramRegistration,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(
      "/api/progres/registration/accept",
      payload,
    );
    return res.data;
  }

  public async rejectProgramRegistration(
    payload: FormRejectProgramRegistration,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(
      "/api/progres/registration/reject",
      payload,
    );
    return res.data;
  }
}

export default ProgramRegistrationApi;
