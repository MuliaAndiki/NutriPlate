export interface IKaderRegistration {
  id: string;
  kaderId: string;
  posyanduId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export type PickCreateKaderRegistration = Pick<IKaderRegistration, 'kaderId' | 'posyanduId'>;

export type PickAcceptKaderRegistration = Pick<IKaderRegistration, 'id' | 'status'>;

export type PickKaderRegistrationID = Pick<IKaderRegistration, 'id'>;
