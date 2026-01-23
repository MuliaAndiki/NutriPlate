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
