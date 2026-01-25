import { differenceInCalendarDays } from "date-fns";

export function formatDayProgress(
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
