import { describe, expect, it } from "bun:test";
interface DailySummaryResponse {
  totals: {
    energyKcal: number;
    proteinGram: number;
    fatGram: number;
    carbGram: number;
    fiberGram: number;
  };
  target: {
    energyKcal: number;
    macro: {
      proteinGram: number;
      carbGram: number;
      fatGram: number;
      fiberGram: number;
    };
  };
}

function aggregateRangeSummary(summaries: DailySummaryResponse[]) {
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
    { energyKcal: 0, proteinGram: 0, fatGram: 0, carbGram: 0, fiberGram: 0 },
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

const makeSummary = (
  energy: number,
  protein: number,
  fat: number,
  carb: number,
  fiber: number,
): DailySummaryResponse => ({
  totals: {
    energyKcal: energy,
    proteinGram: protein,
    fatGram: fat,
    carbGram: carb,
    fiberGram: fiber,
  },
  target: {
    energyKcal: 2000,
    macro: { proteinGram: 50, carbGram: 300, fatGram: 65, fiberGram: 25 },
  },
});

describe("aggregateRangeSummary", () => {
  it("aggregates single day correctly", () => {
    const result = aggregateRangeSummary([makeSummary(500, 20, 15, 70, 5)]);
    expect(result.dayCount).toBe(1);
    expect(result.totals.energyKcal).toBe(500);
    expect(result.target.energyKcal).toBe(2000);
  });

  it("aggregates multiple days", () => {
    const result = aggregateRangeSummary([
      makeSummary(500, 20, 15, 70, 5),
      makeSummary(600, 25, 10, 80, 8),
    ]);

    expect(result.dayCount).toBe(2);
    expect(result.totals.energyKcal).toBe(1100);
    expect(result.totals.proteinGram).toBe(45);
    expect(result.totals.fatGram).toBe(25);
    expect(result.totals.carbGram).toBe(150);
    expect(result.totals.fiberGram).toBe(13);
  });

  it("scales target by day count", () => {
    const result = aggregateRangeSummary([
      makeSummary(100, 10, 5, 30, 2),
      makeSummary(200, 15, 8, 40, 3),
      makeSummary(150, 12, 6, 35, 4),
    ]);

    expect(result.target.energyKcal).toBe(6000); // 2000 * 3
    expect(result.target.macro.proteinGram).toBe(150); // 50 * 3
    expect(result.target.macro.carbGram).toBe(900); // 300 * 3
  });

  it("handles zero totals", () => {
    const result = aggregateRangeSummary([makeSummary(0, 0, 0, 0, 0)]);
    expect(result.totals.energyKcal).toBe(0);
    expect(result.totals.proteinGram).toBe(0);
  });
});
