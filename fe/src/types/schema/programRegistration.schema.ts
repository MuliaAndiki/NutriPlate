export interface IProgramRegistration {
  id: string;
  parentId: string;
  childId: string;
  programId: string;
  posyanduId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface IProgramRegistrationWithRelations extends IProgramRegistration {
  parent?: {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
  };
  child?: {
    id: string;
    fullName: string;
  };
  program?: {
    id: string;
    name: string;
    description?: string;
    startPrograms?: string;
    endPrograms?: string;
  };
  posyandu?: {
    id: string;
    name: string;
  };
}
