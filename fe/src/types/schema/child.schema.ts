import { GenderType, ProfileChild } from "../partial";

export interface IChild {
  id: string;
  parentId: string;
  posyanduID?: string;
  fullname: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: string;
  avaChild?: string;
  profileChild: ProfileChild;
}
