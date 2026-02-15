import { IIotDevice } from "@/types/schema/iotDevice.schema";

export type FormUpdateIotDevice = Pick<
  IIotDevice,
  "id" | "deviceName" | "batteryLevel" | "status"
>;
