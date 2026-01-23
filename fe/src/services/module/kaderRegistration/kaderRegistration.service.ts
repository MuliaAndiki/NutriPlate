import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

interface FormRegisterToposyandu {
  posyanduId: string;
}

interface FormAcceptRegistration {
  id: string;
}

class KaderRegistrationApi {
  public async registerToposyandu(
    payload: FormRegisterToposyandu,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/kader/register", payload);
    return res.data;
  }

  public async getMyRegistrations(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/kader/registrations");
    return res.data;
  }

  public async getPendingRegistrations(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/kader/pending-registrations");
    return res.data;
  }

  public async getAcceptedRegistrations(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/kader/accepted-registrations");
    return res.data;
  }

  public async acceptRegistration(
    payload: FormAcceptRegistration,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(
      "/api/kader/accept-registration",
      payload,
    );
    return res.data;
  }

  public async rejectRegistration(
    payload: FormAcceptRegistration,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(
      "/api/kader/reject-registration",
      payload,
    );
    return res.data;
  }
}

export default KaderRegistrationApi;
