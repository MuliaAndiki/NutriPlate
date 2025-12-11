import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import { FormUpdatePassword, FormUpdateProfile } from "@/types/form/auth.form";
import AxiosClient from "@/utils/axios.client";

class UserApi {
  //min intergrate
  public async editProfile(
    payload: FormUpdateProfile
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put("/api/users/profile", payload);
    return res.data;
  }
  public async deleteAccount(): Promise<TResponse<any>> {
    const res = await AxiosClient.delete("/api/users/account");
    return res.data;
  }
  public async getProfile(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/users/profile");
    return res.data;
  }
  public async updatePassword(
    payload: FormUpdatePassword
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put("/api/users/password", payload);
    return res.data;
  }
  public async getParent(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/users/parent");
    return res.data;
  }
  public async getParentByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/users/parent/${id}`);
    return res.data;
  }
  public async AllReadyLogin(): Promise<TResponse<any>> {
    const res = await AxiosClient.post("/api/users/allReadyLogin");
    return res.data;
  }
  public async getKader(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/users/kader");
    return res.data;
  }
  public async getKaderByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/users/kader/${id}`);
    return res.data;
  }
  public async getChild(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/users/child");
    return res.data;
  }
  public async getChildByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/users/child/${id}`);
    return res.data;
  }
  public async getProfileByID(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.get(`/api/users/profile/${id}`);
    return res.data;
  }
}

export default UserApi;
