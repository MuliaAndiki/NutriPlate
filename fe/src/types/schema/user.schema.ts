export interface IUser {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  password?: string;
  role: "PARENT" | "KADER" | "POSYANDU" | "ADMIN";
  isVerify: boolean;
  otp?: string;
  expOtp?: string;
  token?: string;
  activateExp?: string;
  activateToken?: string;
  createdAt: string;
  updatedAt: string;
  avaUrl?: string;
}

export interface IUserWithRelations extends IUser {
  children?: any[];
  footImage?: any[];
  iotDevices?: any[];
  notifications?: any[];
  program?: any[];
  posyandu?: any[];
  session?: any[];
}
