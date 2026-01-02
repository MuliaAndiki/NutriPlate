import { ProfileChild } from '@/partial/profileChild';
import { GenderType } from '@prisma/client';
export interface IChild {
  id: string;
  parentId: string;
  posyanduID: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: GenderType;
  avaChild: string;
  profileChild: ProfileChild;
}

export type jwtChildPayload = Pick<
  IChild,
  'id' | 'fullName' | 'dateOfBirth' | 'gender' | 'avaChild'
>;
export type PickChilID = Pick<IChild, 'id'>;
export type PickCreateChild = Pick<
  IChild,
  'fullName' | 'dateOfBirth' | 'gender' | 'profileChild' | 'avaChild' | 'placeOfBirth'
>;
export type PickRegisteredChild = Pick<IChild, 'posyanduID'>;
