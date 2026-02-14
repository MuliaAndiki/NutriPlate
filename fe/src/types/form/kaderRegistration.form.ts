import { IKaderRegistration } from "@/types/schema/kaderRegistration.schema";

export type FormRegisterAsKader = Pick<
  IKaderRegistration,
  "kaderId" | "posyanduId"
>;

export type FormAcceptKaderRegistration = Pick<IKaderRegistration, "id">;

export type FormRejectKaderRegistration = Pick<IKaderRegistration, "id">;
