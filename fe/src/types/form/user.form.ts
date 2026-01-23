import { IUser } from "@/types/schema/user.schema";

export type FormUpdateUserProfile = Pick<
  IUser,
  "fullName" | "email" | "phone" | "avaUrl"
>;

export type FormChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type FormVerifyUser = {
  otp: string;
};
