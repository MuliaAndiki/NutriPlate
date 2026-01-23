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

export type FormUpdatePosyandu = Pick<
  IPosyandu,
  "id" | "name" | "scheduleDay" | "avaUrl" | "email" | "phone"
>;

export type FormVerifyPosyandu = {
  email: string;
  otp: string;
};
