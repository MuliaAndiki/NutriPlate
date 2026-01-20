import { MACRO_TARGET_BY_AGE_DATA } from '@/types/macro.types';

export function getMacroTargets(ageMonths: number) {
  if (ageMonths < 0) {
    throw new Error('Invalid ageMonths');
  }

  const closest = MACRO_TARGET_BY_AGE_DATA.reduce((prev, curr) => {
    return Math.abs(curr.ageMonths - ageMonths) < Math.abs(prev.ageMonths - ageMonths)
      ? curr
      : prev;
  });

  return {
    proteinGram: closest.proteinGram,
    carbGram: closest.carbGram,
    fatGram: closest.fatGram,
    fiberGram: closest.fiberGram,
    source: closest.source,
    referenceAgeMonths: closest.ageMonths,
  };
}
