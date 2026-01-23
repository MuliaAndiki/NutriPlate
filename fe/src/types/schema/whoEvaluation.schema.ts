export interface IWhoEvaluation {
  id: string;
  childId: string;
  measurementId: string;
  ageMonths: number;
  heightCm: number;
  weightKg: number;
  zScore: number;
  recommendation: any;
  createdAt: string;
  classification: any;
}
