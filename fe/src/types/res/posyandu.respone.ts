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

export interface ChildItemResponse {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  registeredAt: string;
  parent: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface ChildListByPosyanduData {
  posyandu: {
    id: string;
    name: string;
  };
  totalChildren: number;
  children: ChildItemResponse[];
}

export interface GetChildListByPosyanduResponse {
  status: number;
  message: string;
  data: ChildListByPosyanduData;
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
