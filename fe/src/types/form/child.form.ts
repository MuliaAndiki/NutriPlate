import { IChild } from "../schema/child.schema";

export type PickChilID = Pick<IChild, "id">;
export type FormCreateChild = Pick<
  IChild,
  | "fullName"
  | "dateOfBirth"
  | "gender"
  | "profileChild"
  | "avaChild"
  | "placeOfBirth"
>;
export type FormRegisteredChild = Pick<IChild, "posyanduID">;
export type FormUpdateChild = Pick<
  IChild,
  "avaChild" | "fullName" | "gender" | "placeOfBirth" | "dateOfBirth" | "id"
>;
export type FormUpdateProfileChild = Pick<IChild, "profileChild">;
