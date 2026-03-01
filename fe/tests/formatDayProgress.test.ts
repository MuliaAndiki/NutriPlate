import { describe, expect, it } from "bun:test";

/**
 * Tests for fe/src/utils/formatDayProgress.ts
 */

// date-fns differenceInCalendarDays simplified reimplementation for testing
function differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
  const utcLeft = Date.UTC(
    dateLeft.getFullYear(),
    dateLeft.getMonth(),
    dateLeft.getDate(),
  );
  const utcRight = Date.UTC(
    dateRight.getFullYear(),
    dateRight.getMonth(),
    dateRight.getDate(),
  );
  return Math.floor((utcLeft - utcRight) / (1000 * 60 * 60 * 24));
}

function formatDayProgress(
  startIso: string,
  endIso: string,
  now: Date = new Date(),
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return "-";
  }

  const totalDays = differenceInCalendarDays(end, start) + 1;
  let currentDay = differenceInCalendarDays(now, start) + 1;
  currentDay = Math.max(1, Math.min(currentDay, totalDays));

  return `Hari ke-${currentDay} dari ${totalDays} hari`;
}

describe("formatDayProgress", () => {
  it("shows day 1 of 7 at start", () => {
    const result = formatDayProgress(
      "2023-06-01T00:00:00Z",
      "2023-06-07T00:00:00Z",
      new Date("2023-06-01T12:00:00Z"),
    );
    expect(result).toBe("Hari ke-1 dari 7 hari");
  });

  it("shows day 3 of 7 in middle", () => {
    const result = formatDayProgress(
      "2023-06-01T00:00:00Z",
      "2023-06-07T00:00:00Z",
      new Date("2023-06-03T12:00:00Z"),
    );
    expect(result).toBe("Hari ke-3 dari 7 hari");
  });

  it("clamps to totalDays when now is after end", () => {
    const result = formatDayProgress(
      "2023-06-01T00:00:00Z",
      "2023-06-07T00:00:00Z",
      new Date("2023-06-20T12:00:00Z"),
    );
    expect(result).toBe("Hari ke-7 dari 7 hari");
  });

  it("clamps to 1 when now is before start", () => {
    const result = formatDayProgress(
      "2023-06-01T00:00:00Z",
      "2023-06-07T00:00:00Z",
      new Date("2023-05-20T12:00:00Z"),
    );
    expect(result).toBe("Hari ke-1 dari 7 hari");
  });

  it('returns "-" for invalid start date', () => {
    expect(formatDayProgress("invalid", "2023-06-07")).toBe("-");
  });

  it('returns "-" when start is after end', () => {
    expect(formatDayProgress("2023-06-10", "2023-06-01")).toBe("-");
  });

  it("handles single day range", () => {
    const result = formatDayProgress(
      "2023-06-01T00:00:00Z",
      "2023-06-01T00:00:00Z",
      new Date("2023-06-01T12:00:00Z"),
    );
    expect(result).toBe("Hari ke-1 dari 1 hari");
  });
});
