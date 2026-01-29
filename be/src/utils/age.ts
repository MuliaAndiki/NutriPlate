export function getAgeInMonths(dob: Date | string, refDate = new Date()): number {
  try {
    // Handle both Date and string inputs from Prisma
    const dobDate = typeof dob === 'string' ? new Date(dob) : dob;

    if (isNaN(dobDate.getTime())) {
      console.warn(`⚠️ Invalid date of birth: ${dob}`);
      return 0;
    }

    return Math.max(
      0,
      Math.floor((refDate.getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)),
    );
  } catch (error) {
    console.error(`❌ Error calculating age in months:`, error);
    return 0;
  }
}
