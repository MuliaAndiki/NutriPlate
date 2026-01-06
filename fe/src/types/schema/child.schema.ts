import { ProfileChild } from "../partial";

export interface IChild {
  id: string;
  parentId: string;
  posyanduID?: string;
  fullName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: string;
  avaChild?: string;
  profileChild: ProfileChild;
  createdAt: string;
  updatedAt: string;
}
