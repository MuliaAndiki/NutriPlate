import { describe, expect, it } from "bun:test";

function calculateAge(
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

describe("calculateAge", () => {
  it("returns years and months", () => {
    const dob = new Date("2020-01-15");
    const now = new Date("2023-06-20");
    expect(calculateAge(dob, now)).toBe("3 tahun 5 bulan");
  });

  it("returns only years when exact anniversary", () => {
    const dob = new Date("2020-03-10");
    const now = new Date("2023-03-10");
    expect(calculateAge(dob, now)).toBe("3 tahun");
  });

  it("returns only months for infant", () => {
    const dob = new Date("2023-01-15");
    const now = new Date("2023-06-20");
    expect(calculateAge(dob, now)).toBe("5 bulan");
  });

  it('returns "0 bulan" for same day', () => {
    const dob = new Date("2023-06-20");
    const now = new Date("2023-06-20");
    expect(calculateAge(dob, now)).toBe("0 bulan");
  });

  it("handles cross-year boundary", () => {
    const dob = new Date("2022-11-15");
    const now = new Date("2023-02-20");
    expect(calculateAge(dob, now)).toBe("3 bulan");
  });

  it("adjusts when day of month is earlier", () => {
    const dob = new Date("2020-03-25");
    const now = new Date("2023-03-10");
    // 3 years 0 months → day adjustment makes months go from 0 to -1 → 2 years 11 months
    expect(calculateAge(dob, now)).toBe("2 tahun 11 bulan");
  });

  it("accepts ISO string input", () => {
    expect(calculateAge("2020-01-15", new Date("2023-06-20"))).toBe(
      "3 tahun 5 bulan",
    );
  });
});
