import { ProfileChild } from "../partial";
import { IMeasurement } from "./measurement.schema";

export interface IChild {
  id: string;
  parentId: string;
  posyanduID?: string;
  fullName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: string;
  avaChild?: string;
  createdAt: string;
  updatedAt: string;
  profileChild: ProfileChild;
  measurements?: IMeasurement[];
}
