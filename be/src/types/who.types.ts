import { GenderType } from '@prisma/client';

/**
 * WHO Growth Standard Input
 * Contains child anthropometric measurements
 */
export interface WhoGrowthInput {
  gender: GenderType;
  ageMonths: number;
  heightCm: number;
  weightKg: number;
  headCircumferenceCm?: number;
}

export interface WhoReferenceData {
  median: number;
  sdMinus3: number;
  sdMinus2: number;
  sdMinus1: number;
  sdPlus1: number;
  sdPlus2: number;
  sdPlus3: number;
}

export interface ZScoreCalculation {
  rawValue: number;
  median: number;
  zScore: number;
  method: 'SD_Based';
  closestSD: string;
}

/**
 * Stunting classification levels
 */
export enum StuntingStatus {
  SEVERELY_STUNTED = 'SEVERELY_STUNTED', // z-score < -3 SD
  STUNTED = 'STUNTED', // -3 <= z-score < -2 SD
  NORMAL = 'NORMAL', // -2 <= z-score <= +2 SD
  TALL = 'TALL', // z-score > +2 SD
}

export enum StuntingSeverity {
  SEVERE = 'SEVERE',
  MODERATE = 'MODERATE',
  MILD = 'MILD',
  NORMAL = 'NORMAL',
}

export interface GrowthClassification {
  stuntingStatus: StuntingStatus;
  severity: StuntingSeverity;
  threshold: string;
  sdRange: string;
  percentageOfMedian: number;
}

export interface GrowthRecommendation {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'NORMAL';
  actions: string[];
  referralNeeded: boolean;
  nutritionIntervention: boolean;
  followUpInDays?: number;
}

export interface Traceability {
  rule: string;
  genderUsed: string;
  ageUsedMonths: number;
  source: string;
  dataset: string;
  decisionLogic: string[];
  calculatedAt: string;
}

export interface WhoGrowthEvaluationResponse {
  success: boolean;
  childId: string;
  input: {
    gender: string;
    ageMonths: number;
    heightCm: number;
    weightKg: number;
  };
  whoReference: {
    source: string;
    dataset: string;
    indicator: string;
  };
  calculation: ZScoreCalculation;
  classification: GrowthClassification;
  traceability: Traceability;
  recommendation: GrowthRecommendation;
  metadata: {
    evaluatedAt: string;
    expiresAt?: string;
  };
}
export interface WhoGrowthErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata: {
    evaluatedAt: string;
  };
}

export interface WhoGrowthBulkRequest {
  childId: string;
  measurements: WhoGrowthInput[];
}
