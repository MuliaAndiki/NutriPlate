export function parsePrismaJson<T>(value: unknown): T | null {
  try {
    if (!value) return null;

    // If it's a string (JSON string from database), parse it
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return parsed as T;
    }

    // If it's already an object (Prisma has already parsed it), return as-is
    if (typeof value === 'object') {
      return value as T;
    }

    return null;
  } catch (error) {
    console.warn(`⚠️ Failed to parse Prisma JSON:`, { value, error });
    return null;
  }
}
