export interface IKaderRegistration {
  id: string;
  kaderId: string;
  posyanduId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface IKaderRegistrationWithRelations extends IKaderRegistration {
  kader?: any;
  posyandu?: any;
}
