export interface IPosyandu {
  id: string;
  userID: string;
  name: string;
  village: string;
  subDistrict: string;
  district: string;
  scheduleDay: number;
  createdAt: string;
  avaUrl: string;
  email: string;
  phone: string;
}

export interface IPosyanduWithRelations extends IPosyandu {
  children?: any[];
  iotDevices?: any[];
  programs?: any[];
  user?: any;
  kaderRegistrations?: any[];
  programRegistrations?: any[];
}
