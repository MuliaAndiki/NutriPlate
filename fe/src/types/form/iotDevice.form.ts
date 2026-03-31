import { IIotDevice } from "@/types/schema/iotDevice.schema";

export type FormUpdateIotDevice = Pick<
  IIotDevice,
  "id" | "deviceName" | "batteryLevel" | "status"
>;
export type FormSendCommand = Pick<IIotDevice, "token" | "command">;
export type FormRegisterDevice = Pick<
  IIotDevice,
  "token" | "name" | "pairingToken" | "posyanduId" | "parentId"
>;
