export interface MacroTargetByAge {
  ageMonths: number;
  energyKcal?: number;
  proteinGram: number;
  carbGram: number;
  fatGram: number;
  fiberGram: number;
  source: string;
}

export const MACRO_TARGET_BY_AGE_DATA: MacroTargetByAge[] = [
  {
    ageMonths: 6,
    proteinGram: 15,
    carbGram: 95,
    fatGram: 30,
    fiberGram: 5,
    source: 'AKG Indonesia ',
  },
  {
    ageMonths: 12,
    proteinGram: 20,
    carbGram: 130,
    fatGram: 35,
    fiberGram: 10,
    source: 'AKG Indonesia ',
  },
  {
    ageMonths: 24,
    proteinGram: 25,
    carbGram: 140,
    fatGram: 40,
    fiberGram: 15,
    source: 'AKG Indonesia ',
  },
  {
    ageMonths: 36,
    proteinGram: 30,
    carbGram: 150,
    fatGram: 45,
    fiberGram: 18,
    source: 'AKG Indonesia ',
  },
  {
    ageMonths: 60,
    proteinGram: 35,
    carbGram: 180,
    fatGram: 50,
    fiberGram: 25,
    source: 'AKG Indonesia ',
  },
];
