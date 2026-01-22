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

export interface CreateChildResponse {
  status: number;
  message: string;
  data: ChildRespone;
}

export interface UpdateChildResponse {
  status: number;
  message: string;
  data: ChildRespone;
}

export interface DeleteChildResponse {
  status: number;
  message: string;
}

export interface RegisterChildResponse {
  status: number;
  message: string;
  data: ChildRespone;
}

export interface CancelRegisterResponse {
  status: number;
  message: string;
  data: ChildRespone;
}

export interface GetChildResponse {
  status: number;
  message: string;
  data: ChildRespone[];
}

export interface GetChildByIDResponse {
  status: number;
  message: string;
  data: ChildRespone;
}
