import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import {
  FormRegisterChildToProgram,
  FormAcceptProgramRegistration,
  FormRejectProgramRegistration,
} from "@/types/form/programRegistration.form";
import AxiosClient from "@/utils/axios.client";

class ProgramRegistrationApi {
  // Create registration/assignment (parent register OR posyandu assign)
  public async registerChildToProgram(
    payload: FormRegisterChildToProgram,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/progres/registrations", payload);
    return res.data;
  }

  // Get registrations (parent/posyandu can see their registrations)
  public async getProgramRegistrations(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/progres/registrations");
    return res.data;
  }

  // Accept registration
  public async acceptProgramRegistration(
    payload: FormAcceptProgramRegistration,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(
      `/api/progres/registrations/${payload.id}/accept`,
      {},
    );
    return res.data;
  }

  // Reject registration
  public async rejectProgramRegistration(
    payload: FormRejectProgramRegistration,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(
      `/api/progres/registrations/${payload.id}/reject`,
      {},
    );
    return res.data;
  }
}

export default ProgramRegistrationApi;
