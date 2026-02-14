import { DailySummaryResponse } from "@/types/res";

export function aggregateRangeSummary(summaries: DailySummaryResponse[]) {
  const dayCount = summaries.length;

  const totals = summaries.reduce(
    (acc, d) => {
      acc.energyKcal += d.totals.energyKcal;
      acc.proteinGram += d.totals.proteinGram;
      acc.fatGram += d.totals.fatGram;
      acc.carbGram += d.totals.carbGram;
      acc.fiberGram += d.totals.fiberGram;
      return acc;
    },
    {
      energyKcal: 0,
      proteinGram: 0,
      fatGram: 0,
      carbGram: 0,
      fiberGram: 0,
    },
  );

  const dailyTarget = summaries[0].target;

  return {
    dayCount,
    totals,
    target: {
      energyKcal: dailyTarget.energyKcal * dayCount,
      macro: {
        proteinGram: dailyTarget.macro.proteinGram * dayCount,
        carbGram: dailyTarget.macro.carbGram * dayCount,
        fatGram: dailyTarget.macro.fatGram * dayCount,
        fiberGram: dailyTarget.macro.fiberGram * dayCount,
      },
    },
  };
}
