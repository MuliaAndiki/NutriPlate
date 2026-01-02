export function parsePayload<T extends Record<string, unknown>>(
  original: T,
  current: T
): Partial<T> {
  const payload: Partial<T> = {};

  (Object.keys(current) as (keyof T)[]).forEach((key) => {
    const prev = original[key];
    const curr = current[key];

    if (curr === undefined || curr === null) return;

    if (typeof curr === "string" && curr.trim() === "") return;

    if (Object.is(curr, prev)) return;

    payload[key] = curr;
  });

  return payload;
}
