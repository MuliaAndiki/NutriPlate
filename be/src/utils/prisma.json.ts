export function parsePrismaJson<T>(value: unknown): T | null {
  if (!value) return null;
  if (typeof value !== 'object') return null;
  return value as T;
}
