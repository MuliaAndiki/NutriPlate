import { RoleType } from "../partial";

export interface IAuth {
  id: string;
  email: string;
  fullName: string;
  password: string;
  phone: string;
  token?: string;
  role: RoleType;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
  expOtp?: Date;
  isVerify?: boolean;
  activateToken?: string;
  activateExp?: string;
  sessionId: string;
}
