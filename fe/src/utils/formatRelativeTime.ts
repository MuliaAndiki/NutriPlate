import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function formatRelativeTime(
  isoString: string,
  options?: {
    withSuffix?: boolean;
  },
): string {
  if (!isoString) return "-";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "-";

  return formatDistanceToNow(date, {
    addSuffix: options?.withSuffix ?? true,
    locale: id,
  });
}
