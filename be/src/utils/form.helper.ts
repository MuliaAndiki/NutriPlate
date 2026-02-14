export function parseDateTime(value: unknown, fieldName = 'DateTime'): Date {
  if (!value || typeof value !== 'string') {
    throw new Error(`${fieldName} is required and must be a string`);
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ${fieldName} format`);
  }

  return date;
}
