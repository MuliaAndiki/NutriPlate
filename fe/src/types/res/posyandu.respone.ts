import { IPosyandu } from "../schema/posyandu.schema";

export interface PosyanduRespone {
  id: string;
  name: string;
  village: string;
  subDistrict: string;
  district: string;
  scheduleDay: number;
  avaUrl: string;
  phone: string;
  email: string;
}

export interface PosyanduDetailResponse extends PosyanduRespone {
  userID: string;
}

export interface CreatePosyanduResponse {
  status: number;
  message: string;
  data: PosyanduDetailResponse;
}

export interface GetPosyanduResponse {
  status: number;
  message: string;
  data: PosyanduDetailResponse[];
}

export interface GetPosyanduByIDResponse {
  status: number;
  message: string;
  data: PosyanduDetailResponse;
}

export interface UpdatePosyanduResponse {
  status: number;
  message: string;
  data: PosyanduDetailResponse;
}

export interface DeletePosyanduResponse {
  status: number;
  message: string;
}

export interface ActiveAccountResponse {
  status: number;
  message: string;
  data?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}
