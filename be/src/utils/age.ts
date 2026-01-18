export function getAgeInMonths(dob: Date, refDate = new Date()): number {
  return Math.max(
    0,
    Math.floor((refDate.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)),
  );
}
