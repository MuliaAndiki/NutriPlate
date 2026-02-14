import { FormatDateOptions } from "@/types/utils";

export function formatDateTime(
  isoString: string | Date,
  options: FormatDateOptions = {},
): string {
  if (!isoString) return "-";

  const dateString =
    typeof isoString === "string" ? isoString : isoString.toISOString();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const { locale = "id-ID", timeZone = "Asia/Jakarta" } = options as any;

  switch (options.style) {
    case "input":
      return dateString.split("T")[0];

    case "time":
      return dateString.split("T")[1]?.slice(0, 5) ?? "-";

    case "day-date-slash": {
      const dayName = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        timeZone,
      }).format(date);

      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();

      return `${dayName}, ${dd}/${mm}/${yyyy}`;
    }

    case "datetime":
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
      }).format(date);

    case "date":
    default:
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone,
      }).format(date);
  }
}
