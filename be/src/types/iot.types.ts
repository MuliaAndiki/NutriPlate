import { IotStatus } from "@prisma/client";

export interface IIot {
  id: string;
  parentID: string;
  posyanduID: string;
  mac_addres: string;
  device_name: string;
  pairing_token: string;
  pairing_expires_at: string;
  battery: number;
  last_online: string;
  status: IotStatus;
}
