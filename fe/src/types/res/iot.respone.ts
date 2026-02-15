export interface IotDeviceResponse {
  id: string;
  parentId?: string;
  posyanduId?: string;
  deviceToken: string;
  deviceName: string;
  pairingToken?: string;
  lastWeight?: number | null;
  lastStableWeight?: number | null;
  lastStatus?: string | null;
  lastOnline?: Date | string | null;
  batteryLevel?: number | null;
  firmwareVersion?: string | null;
  ipAddress?: string | null;
  status: "online" | "offline" | "error";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RebootIotResponse {
  status: number;
  message: string;
  data?: {
    macAddress: string;
    status: string;
  };
}

export type GetStatusIotRespone = IotDeviceResponse;

export interface GetWeightIorRespone {
  weight: number | null;
}
