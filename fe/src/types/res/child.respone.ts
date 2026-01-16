import { ProfileChild } from "../partial";
import { IChild } from "../schema/child.schema";
import { IProgress } from "../schema/progres.schema";

export interface ChildRespone extends IChild {
  profileChild: ProfileChild;
  programProgress: IProgress[];
}
