import { SupportedCurrency } from "@/types/utils";

interface FormatNumberOptions {
  currency?: SupportedCurrency;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatNumber(
  num: number,
  options?: FormatNumberOptions
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

  // 🔹 Normal number
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}
