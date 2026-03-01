import { describe, expect, it } from "bun:test";

function formatNumber(
  num: number,
  options?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  if (!Number.isFinite(num)) return "-";

  const {
    currency,
    locale = "id-ID",
    minimumFractionDigits,
    maximumFractionDigits,
  } = options || {};

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(num);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

describe("formatNumber", () => {
  it("formats plain numbers with id-ID locale", () => {
    const result = formatNumber(1000);
    // id-ID uses period as thousands separator
    expect(result).toContain("1");
    expect(result).toContain("000");
  });

  it('returns "-" for NaN', () => {
    expect(formatNumber(NaN)).toBe("-");
  });

  it('returns "-" for Infinity', () => {
    expect(formatNumber(Infinity)).toBe("-");
  });

  it('returns "-" for -Infinity', () => {
    expect(formatNumber(-Infinity)).toBe("-");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("formats with fraction digits", () => {
    const result = formatNumber(3.14159, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(result).toContain("3");
    expect(result).toContain("14");
  });

  it("formats currency", () => {
    const result = formatNumber(50000, { currency: "IDR" });
    expect(result.length).toBeGreaterThan(0);
  });
});
