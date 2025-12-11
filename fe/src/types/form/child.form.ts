import { IChild } from "../schema/child.schema";

export type PickChilID = Pick<IChild, "id">;
export type FormCreateChild = Pick<
  IChild,
  "fullname" | "dateOfBirth" | "gender" | "profileChild" | "photoUrl"
>;
