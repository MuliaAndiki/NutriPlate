import {
  NutritionStatus,
  StuntingStatus,
  StuntingSeverity,
  WhoRiskLevel,
} from "@/types/partial/index";

export type IntakeProgressStatus = "GOOD" | "ENOUGH" | "LOW";

export interface DailySummaryResponse {
  childId: string;
  date: string;
  ageMonths: number;

  who: {
    stuntingStatus: StuntingStatus;
    severity: StuntingSeverity;
    zScore: number | null;
    riskLevel: WhoRiskLevel;
  } | null;

  totals: {
    energyKcal: number;
    proteinGram: number;
    fatGram: number;
    carbGram: number;
    fiberGram: number;
  };

  target: {
    energyKcal: number;
    baseEnergyKcal: number;
    correctionFactor: number;
    nutritionStatus: NutritionStatus;
    macro: {
      proteinGram: number;
      carbGram: number;
      fatGram: number;
      fiberGram: number;
    };
  };

  progress: {
    energyPercent: number;
    status: IntakeProgressStatus;
  };
}
