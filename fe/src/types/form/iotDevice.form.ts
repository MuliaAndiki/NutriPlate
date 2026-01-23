import { IIotDevice } from "@/types/schema/iotDevice.schema";

export type FormCreateIotDevice = Pick<
  IIotDevice,
  "parentId" | "posyanduId" | "macAddress" | "deviceName" | "pairingToken"
>;

export type FormUpdateIotDevice = Pick<
  IIotDevice,
  "id" | "deviceName" | "batteryLevel" | "status"
>;

export type FormPairDevice = Pick<IIotDevice, "macAddress" | "pairingToken">;
