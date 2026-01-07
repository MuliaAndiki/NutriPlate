export interface IAuth {
  id: string;
  email: string;
  identifier: string;
  fullName: string;
  password: string;
  phone: string;
  token?: string;
  role: string;
  avaUrl: string;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
  expOtp?: Date;
  isVerify?: boolean;
  activateToken?: string;
  activateExp?: string;
  sessionId: string;
}
