export function camelCaseToWords(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

export function kebabCaseToWords(str: string) {
  return str.replace(/[-/]/g, " ").replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

export function GenderFormat(gender: string) {
  if (gender === "MALE") {
    return "Laki-Laki";
  } else {
    return "Perempuan";
  }
}

export const formatDateForInput = (date: string) => {
  if (!date) return "";
  return date.split("T")[0];
};

export function normalizeToLowercase<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.toLowerCase()];
      }
      if (Array.isArray(value)) {
        return [
          key,
          value.map((v) => (typeof v === "string" ? v.toLowerCase() : v)),
        ];
      }
      return [key, value];
    }),
  ) as T;
}

export function calculateDuration(startTime: string, estimasiJam: number) {
  const startDate = new Date(startTime);
  const selesai = new Date(startDate.getTime() + estimasiJam * 60 * 60 * 1000);
  return selesai.toLocaleString();
}
