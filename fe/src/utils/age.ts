export function calculateAge(
  dateOfBirth: string | Date,
  now: Date = new Date(),
): string {
  const dob = new Date(dateOfBirth);

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (now.getDate() < dob.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  const yearText = years > 0 ? `${years} tahun` : "";
  const monthText = months > 0 ? `${months} bulan` : "";

  if (!yearText && !monthText) return "0 bulan";

  return [yearText, monthText].filter(Boolean).join(" ");
}
