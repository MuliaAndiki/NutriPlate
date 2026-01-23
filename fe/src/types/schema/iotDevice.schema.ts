export interface IIotDevice {
  id: string;
  parentId?: string;
  posyanduId?: string;
  macAddress: string;
  deviceName: string;
  pairingToken?: string;
  pairingExpiresAt?: string;
  batteryLevel?: number;
  lastOnline?: string;
  status: "online" | "offline" | "error";
  createdAt: string;
  updatedAt: string;
}
