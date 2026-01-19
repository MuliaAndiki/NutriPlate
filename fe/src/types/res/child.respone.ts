import { ProfileChild } from "../partial";
import { IChild } from "../schema/child.schema";
import { IPosyandu } from "../schema/posyandu.schema";
import { IProgress } from "../schema/progres.schema";

export interface ChildPartial extends IChild {
  profileChild: ProfileChild;
}

export interface ChildRespone extends IChild {
  profileChild: ProfileChild;
  programProgress: IProgress[];
  posyandu: IPosyandu;
}
