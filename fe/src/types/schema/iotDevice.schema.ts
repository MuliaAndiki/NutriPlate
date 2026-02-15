export interface IIotDevice {
  id: string;
  parentId?: string;
  posyanduId?: string;
  deviceToken: string;
  deviceName: string;
  pairingToken?: string;
  lastWeight?: number | null;
  lastStableWeight?: number | null;
  lastStatus?: string | null;
  lastOnline?: string | null;
  batteryLevel?: number | null;
  status: "online" | "offline" | "error";
  firmwareVersion?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  updatedAt: string;
}
