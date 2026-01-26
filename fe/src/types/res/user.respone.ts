import { IAuth } from "../schema/auth.schema";

export interface UserProfileResponse extends IAuth {}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  avaUrl: string;
  isVerify: boolean;
  createdAt: Date;
  updatedAt: Date;
  posyanduId?: string | null;
  posyanduName?: string | null;
}

export interface KaderListResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avaUrl: string;
}

export interface ParentListResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avaUrl: string;
}

export interface EditProfileResponse {
  status: number;
  message: string;
  data: UserResponse;
}

export interface DeleteAccountResponse {
  status: number;
  message: string;
}

export interface UpdatePasswordResponse {
  status: number;
  message: string;
}

export interface AllReadyLoginResponse {
  status: number;
  message: string;
  data: {
    isLogin: boolean;
  };
}

export interface GetKaderResponse {
  status: number;
  message: string;
  data: KaderListResponse[];
}

export interface GetKaderByIDResponse {
  status: number;
  message: string;
  data: KaderListResponse;
}

export interface GetParentResponse {
  status: number;
  message: string;
  data: ParentListResponse[];
}

export interface GetParentByIDResponse {
  status: number;
  message: string;
  data: ParentListResponse;
}
