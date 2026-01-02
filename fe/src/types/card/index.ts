import { IChild } from "../schema/child.schema";
import { IconifyIcon } from "@iconify/react";
export interface HistoryFoodType {
  id: string;
  image: string;
  date: string;
  title: string;
  weight: number;
  gizi: number;
}

export type ChildCardType = Pick<
  IChild,
  | "avaChild"
  | "dateOfBirth"
  | "fullName"
  | "gender"
  | "parentId"
  | "placeOfBirth"
  | "id"
  | "profileChild"
>;

export interface ProfileChildType {
  key: string;
  label: string;
  unit?: string;
  header: string;
  icon: string;
  color: string;
  text: string;
  border: string;
  getValue: (profile: any) => number | string | null;
}
