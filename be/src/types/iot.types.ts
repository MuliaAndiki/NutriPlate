import { IotStatus } from '@prisma/client';

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

export type IotCommand =
  | 'tare'
  | 'start-weighing'
  | 'cancel-weighing'
  | 'hold-weight'
  | 'confirm-weight'
  | 'reject-weight'
  | 'reset'
  | 'reboot'
  | 'config-mode';

export interface IotCommandPayload {
  type: IotCommand;
  sent: boolean;
  createdAt: string;
}

export interface IotStatusRequest {
  token: string;
  weight: number;
  stable_weight?: number;
  status: string;
}

export interface IotCommandExecutedRequest {
  token: string;
  command: IotCommand;
  status: 'success' | 'failed';
}

export interface IotSendCommandRequest {
  token: string;
  command: IotCommand;
}

export interface IotRegisterRequest {
  token: string;
  name: string;
  macAddress?: string;
  parentId?: string;
  posyanduId?: string;
  pairingToken?: string;
}

export interface IotUpdateRequest {
  deviceName?: string;
  parentId?: string | null;
  posyanduId?: string | null;
  pairingToken?: string | null;
  batteryLevel?: number | null;
  firmwareVersion?: string | null;
  ipAddress?: string | null;
}
