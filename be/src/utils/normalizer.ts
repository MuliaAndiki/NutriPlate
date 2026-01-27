export function normalizeFoodClassKey(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, '_').replace(/_+/g, '_');
}
