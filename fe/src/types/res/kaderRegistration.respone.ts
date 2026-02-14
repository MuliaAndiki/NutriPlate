import { PosyanduRespone } from "./posyandu.respone";

export interface KaderDetailResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avaUrl?: string;
}

export interface KaderRegistrationDetailResponse {
  id: string;
  kaderId: string;
  posyanduId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  kader?: KaderDetailResponse;
  posyandu?: PosyanduRespone;
}

export interface RegisterToPosyanduResponse {
  status: number;
  message: string;
  data: KaderRegistrationDetailResponse;
}

export interface GetMyRegistrationsResponse {
  status: number;
  message: string;
  data: KaderRegistrationDetailResponse[];
}

export interface GetPendingRegistrationsResponse {
  status: number;
  message: string;
  data: KaderRegistrationDetailResponse[];
}

export interface GetAcceptedRegistrationsResponse {
  status: number;
  message: string;
  data: KaderRegistrationDetailResponse[];
}

export interface AcceptRegistrationResponse {
  status: number;
  message: string;
  data: KaderRegistrationDetailResponse;
}

export interface RejectRegistrationResponse {
  status: number;
  message: string;
  data: KaderRegistrationDetailResponse;
}
