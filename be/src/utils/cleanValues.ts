export function cleanNaNValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanNaNValues(item));
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        // Ganti NaN, undefined string "NaN", "Nan"
        if (typeof value === 'number' && isNaN(value)) {
          cleaned[key] = null;
        } else if (value === 'NaN' || value === 'Nan') {
          cleaned[key] = null;
        } else {
          cleaned[key] = cleanNaNValues(value);
        }
      }
    }
    return cleaned;
  }

  return obj;
}
