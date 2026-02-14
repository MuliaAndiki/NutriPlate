import {
  ZScoreCalculation,
  WhoReferenceData,
  GrowthClassification,
  StuntingStatus,
  StuntingSeverity,
  GrowthRecommendation,
} from '@/types/who.types';

class WhoGrowthCalculationService {
  public calculateZScore(value: number, reference: WhoReferenceData): ZScoreCalculation {
    const median = reference.median;
    const difference = value - median;

    let zScore: number;
    let closestSD: string;

    if (value >= median) {
      const sdPlus1Range = (reference.sdPlus1 - median) / 1;
      if (value >= reference.sdPlus2) {
        zScore = ((value - median) / (reference.sdPlus1 - median)) * 1 + (value >= median ? 0 : 0);
        closestSD = value >= reference.sdPlus3 ? '+3 SD' : '+2 SD';
      } else if (value >= reference.sdPlus1) {
        zScore = ((value - median) / (reference.sdPlus1 - median)) * 1;
        closestSD = '+1 SD';
      } else {
        zScore = ((value - median) / (reference.sdPlus1 - median)) * 1;
        closestSD = '0 SD';
      }
    } else {
      const sdMinus1 = reference.sdMinus1;
      const sdMinus2 = reference.sdMinus2;
      const sdMinus3 = reference.sdMinus3;

      if (value <= sdMinus3) {
        zScore = -3 + ((value - sdMinus3) / (sdMinus2 - sdMinus3)) * 1;
        closestSD = value <= sdMinus3 ? '-3 SD' : '-2 SD';
      } else if (value <= sdMinus2) {
        zScore = -2 + ((value - sdMinus2) / (sdMinus1 - sdMinus2)) * 1;
        closestSD = '-2 SD';
      } else if (value <= sdMinus1) {
        zScore = -1 + ((value - sdMinus1) / (median - sdMinus1)) * 1;
        closestSD = '-1 SD';
      } else {
        zScore = ((value - median) / (sdMinus1 - median)) * 1;
        closestSD = '0 SD';
      }
    }

    zScore = Math.round(zScore * 100) / 100;

    return {
      rawValue: value,
      median,
      zScore,
      method: 'SD_Based',
      closestSD,
    };
  }

  public classifyGrowthStatus(
    zScore: number,
    referenceMedian: number,
    actualValue: number,
  ): GrowthClassification {
    let stuntingStatus: StuntingStatus;
    let severity: StuntingSeverity;
    let threshold: string;
    let sdRange: string;

    if (zScore < -3) {
      stuntingStatus = StuntingStatus.SEVERELY_STUNTED;
      severity = StuntingSeverity.SEVERE;
      threshold = '< -3 SD';
      sdRange = 'Below -3 SD';
    } else if (zScore < -2) {
      stuntingStatus = StuntingStatus.STUNTED;
      severity = StuntingSeverity.MODERATE;
      threshold = '-2 to -3 SD';
      sdRange = '-3 to -2 SD';
    } else if (zScore <= 2) {
      stuntingStatus = StuntingStatus.NORMAL;
      severity = StuntingSeverity.NORMAL;
      threshold = '-2 to +2 SD';
      sdRange = '-2 to +2 SD';
    } else {
      stuntingStatus = StuntingStatus.TALL;
      severity = StuntingSeverity.NORMAL;
      threshold = '> +2 SD';
      sdRange = 'Above +2 SD';
    }

    const percentageOfMedian = Math.round((actualValue / referenceMedian) * 100 * 100) / 100;

    return {
      stuntingStatus,
      severity,
      threshold,
      sdRange,
      percentageOfMedian,
    };
  }

  public generateRecommendation(
    classification: GrowthClassification,
    ageMonths: number,
  ): GrowthRecommendation {
    const { stuntingStatus, severity } = classification;
    const actions: string[] = [];
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'NORMAL';
    let referralNeeded = false;
    let nutritionIntervention = false;
    let followUpInDays: number | undefined;

    if (stuntingStatus === StuntingStatus.SEVERELY_STUNTED) {
      riskLevel = 'CRITICAL';
      actions.push(' URGENT: Immediate nutrition intervention required');
      actions.push('Referral to health facility for medical evaluation');
      actions.push('Immediate dietary improvement plan needed');
      actions.push('Consider complementary feeding assessment');
      actions.push('Test for infections (TB, worms, malaria)');
      referralNeeded = true;
      nutritionIntervention = true;
      followUpInDays = 7;
    } else if (stuntingStatus === StuntingStatus.STUNTED) {
      riskLevel = 'HIGH';
      actions.push(' Nutrition intervention required');
      actions.push('Monitor growth monthly at Posyandu');
      actions.push('Improve complementary feeding quality and quantity');
      actions.push('Consider micronutrient supplementation');
      actions.push('Counsel on feeding practices');
      actions.push('Consider referral if no improvement in 3 months');
      referralNeeded = true;
      nutritionIntervention = true;
      followUpInDays = 30;
    } else if (stuntingStatus === StuntingStatus.NORMAL) {
      riskLevel = 'LOW';
      actions.push(' Growth is normal - continue current feeding practices');
      actions.push('Maintain routine immunization');
      actions.push('Continue exclusive breastfeeding if < 6 months');
      actions.push('Introduce appropriate complementary foods at 6 months');
      actions.push('Regular health check-ups every 2-3 months');
      referralNeeded = false;
      nutritionIntervention = false;
      followUpInDays = 60;
    } else {
      riskLevel = 'NORMAL';
      actions.push('✨ Excellent growth - child is above normal height');
      actions.push('Continue current nutritional practices');
      actions.push('Monitor for appropriate weight gain');
      actions.push('Regular health check-ups');
      referralNeeded = false;
      nutritionIntervention = false;
      followUpInDays = 90;
    }

    return {
      riskLevel,
      actions,
      referralNeeded,
      nutritionIntervention,
      followUpInDays,
    };
  }

  public validateAge(ageMonths: number): { valid: boolean; error?: string } {
    if (ageMonths < 0 || ageMonths > 120) {
      return {
        valid: false,
        error: `Invalid age: ${ageMonths} months. Age should be between 0-120 months`,
      };
    }
    return { valid: true };
  }

  public validateMeasurements(
    heightCm: number,
    weightKg: number,
    ageMonths: number,
  ): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (heightCm <= 0 || heightCm > 150) {
      errors.push(`Invalid height: ${heightCm}cm. Expected 0-150cm`);
    }

    if (weightKg <= 0 || weightKg > 50) {
      errors.push(`Invalid weight: ${weightKg}kg. Expected 0-50kg`);
    }

    if (ageMonths < 6 && heightCm > 80) {
      errors.push(`Height ${heightCm}cm seems too high for age ${ageMonths} months`);
    }

    if (ageMonths > 60 && heightCm < 70) {
      errors.push(`Height ${heightCm}cm seems too low for age ${ageMonths} months`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}

export default new WhoGrowthCalculationService();
