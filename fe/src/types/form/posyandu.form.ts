import { IPosyandu } from "../schema/posyandu.schema";

export type FormPosyanduID = Pick<IPosyandu, "id">;
export type FormCreatePosyandu = Pick<
  IPosyandu,
  | "name"
  | "district"
  | "phone"
  | "avaUrl"
  | "scheduleDay"
  | "village"
  | "subDistrict"
  | "email"
>;

export type FormOtpPosyanduVerify = Pick<IPosyandu, "email" | "otp">;
