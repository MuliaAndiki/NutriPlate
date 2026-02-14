import { NutritionStatus } from '@prisma/client';

export function getBaseEnergyKcal(ageMonths: number): number {
  if (ageMonths < 6) return 550;
  if (ageMonths < 12) return 800;
  if (ageMonths < 36) return 1100;
  if (ageMonths < 60) return 1300;
  return 1500;
}

export function getEnergyCorrectionFactor(nutritionStatus?: NutritionStatus): number {
  switch (nutritionStatus) {
    case 'severely_underweight':
      return 1.3;
    case 'underweight':
      return 1.15;
    case 'overweight':
      return 0.9;
    case 'normal':
    default:
      return 1.0;
  }
}
