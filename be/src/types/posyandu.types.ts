export interface IPosyandu {
  id: string;
  name: string;
  village: string;
  subDistrict: string;
  district: string;
  scheduleDay: number;
  avaUrl: string;
  phone: string;
  email: string;
  otp: string;
  expOtps: string;
}

export type PickPosyanduID = Pick<IPosyandu, 'id'>;
export type PickCreatePosyandu = Pick<
  IPosyandu,
  'name' | 'district' | 'phone' | 'avaUrl' | 'scheduleDay' | 'village' | 'subDistrict' | 'email'
>;

export type PickOtpPosyanduVerify = Pick<IPosyandu, 'email' | 'otp'>;
