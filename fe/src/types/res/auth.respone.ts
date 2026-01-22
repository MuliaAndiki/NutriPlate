import { IAuth } from "../schema/auth.schema";

export interface AuthResponse extends IAuth {
  token?: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthResponse;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: AuthResponse;
}

export interface LogoutResponse {
  status: number;
  message: string;
}

export interface ForgotPasswordResponse {
  status: number;
  message: string;
  data?: {
    email: string;
  };
}

export interface VerifyOtpResponse {
  status: number;
  message: string;
  data?: AuthResponse;
}

export interface ResendOtpResponse {
  status: number;
  message: string;
}

export interface ResetPasswordResponse {
  status: number;
  message: string;
}

export interface GoogleLoginResponse {
  status: number;
  message: string;
  data: AuthResponse;
}
