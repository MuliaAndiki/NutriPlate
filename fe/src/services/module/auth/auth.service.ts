import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import {
  FormForgotPassword,
  FormLogin,
  FormRegister,
  FormResetPassword,
  FormSendOtp,
  FormVerify,
} from "@/types/form/auth.form";
import AxiosClient from "@/utils/axios.client";

class AuthApi {
  public async Login(payload: FormLogin): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/login", payload);
    return res.data;
  }
  public async Register(payload: FormRegister): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/register", payload);
    return res.data;
  }
  public async Logout(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/logout");
    return res.data;
  }
  public async forgot(payload: FormForgotPassword): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/forgot", payload);
    return res.data;
  }
  public async verifyOtp(payload: FormVerify): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/verifyOtp", payload);
    return res.data;
  }
  public async resend(payload: FormSendOtp): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/resend", payload);
    return res.data;
  }
  public async resetPassword(
    payload: FormResetPassword,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/auth/reset-password", payload);
    return res.data;
  }
}

export default AuthApi;
