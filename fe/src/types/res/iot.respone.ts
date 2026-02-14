export interface IotDeviceResponse {
  id: string;
  parentId?: string;
  posyanduId?: string;
  macAddress: string;
  deviceName: string;
  pairingToken?: string;
  pairingExpiresAt?: Date;
  batteryLevel?: number;
  lastOnline?: Date;
  status: "online" | "offline" | "error";
  createdAt: Date;
  updatedAt: Date;
}

export interface RebootIotResponse {
  status: number;
  message: string;
  data?: {
    macAddress: string;
    status: string;
  };
}

export interface GetStatusIotRespone {
  id: string;
  name: string;
  status: string;
  weight: number;
  stable_weight: number;
  cal_factor: number;
  state: number;
  ip: string;
  state_description: string;
}

export interface GetWeightIorRespone {
  weight: number | null;
}
