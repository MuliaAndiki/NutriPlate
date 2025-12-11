import { GenderType, ProfileChild } from "../partial";

export interface IChild {
  id: string;
  parentId: string;
  posyanduID: string;
  fullname: string;
  dateOfBirth: string;
  gender: GenderType;
  photoUrl: string;
  profileChild: ProfileChild;
}
