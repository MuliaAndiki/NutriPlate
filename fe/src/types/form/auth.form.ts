import { IAuth } from "../schema/auth.schema";
export type JwtPayload = Pick<IAuth, "id" | "role" | "sessionId">;
export type FormRegister = Pick<
  IAuth,
  "fullName" | "password" | "role" | "identifier"
>;
export type FormLogin = Pick<IAuth, "password" | "identifier">;
export type FormIDAuth = Pick<IAuth, "id">;
export type FormForgotPassword = Pick<IAuth, "email" | "phone">;
export type FormVerify = Pick<IAuth, "email" | "otp">;
export type FormSendOtp = Pick<IAuth, "email">;
export type FormResetPassword = Pick<IAuth, "email" | "password" | "phone">;
export type FormUpdateProfile = Pick<
  IAuth,
  "email" | "fullName" | "photoUrl" | "phone"
>;
export type FormUpdatePassword = Pick<IAuth, "password">;
export type FormActiveAccount = Pick<IAuth, "activateToken" | "password">;
export type FormLoginAllReady = Pick<IAuth, "token">;
