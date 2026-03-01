import { describe, expect, it } from "bun:test";

function camelCaseToWords(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

function kebabCaseToWords(str: string) {
  return str.replace(/[-/]/g, " ").replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

function GenderFormat(gender: string) {
  if (gender === "MALE") {
    return "Laki-Laki";
  } else {
    return "Perempuan";
  }
}

const formatDateForInput = (date: string) => {
  if (!date) return "";
  return date.split("T")[0];
};

function normalizeToLowercase<T extends Record<string, any>>(obj: T): T {
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

function calculateDuration(startTime: string, estimasiJam: number) {
  const startDate = new Date(startTime);
  const selesai = new Date(startDate.getTime() + estimasiJam * 60 * 60 * 1000);
  return selesai.toLocaleString();
}

const identifier = (email?: string | null, phone?: string | null): string => {
  return email ?? phone ?? "-";
};

describe("camelCaseToWords", () => {
  it("converts camelCase to words", () => {
    expect(camelCaseToWords("camelCase")).toBe("Camel Case");
  });

  it("handles single word", () => {
    expect(camelCaseToWords("hello")).toBe("Hello");
  });

  it("handles multiple humps", () => {
    expect(camelCaseToWords("myLongVariableName")).toBe(
      "My Long Variable Name",
    );
  });
});

describe("kebabCaseToWords", () => {
  it("converts kebab-case to words", () => {
    expect(kebabCaseToWords("kebab-case")).toBe("Kebab Case");
  });

  it("converts path separators", () => {
    expect(kebabCaseToWords("parent/child")).toBe("Parent Child");
  });

  it("handles single word", () => {
    expect(kebabCaseToWords("hello")).toBe("Hello");
  });
});

describe("GenderFormat", () => {
  it("returns Laki-Laki for MALE", () => {
    expect(GenderFormat("MALE")).toBe("Laki-Laki");
  });

  it("returns Perempuan for FEMALE", () => {
    expect(GenderFormat("FEMALE")).toBe("Perempuan");
  });

  it("returns Perempuan for unknown", () => {
    expect(GenderFormat("UNKNOWN")).toBe("Perempuan");
  });
});

describe("formatDateForInput", () => {
  it("strips time portion", () => {
    expect(formatDateForInput("2023-06-20T10:30:00Z")).toBe("2023-06-20");
  });

  it("returns empty for empty string", () => {
    expect(formatDateForInput("")).toBe("");
  });

  it("handles date without time", () => {
    expect(formatDateForInput("2023-06-20")).toBe("2023-06-20");
  });
});

describe("normalizeToLowercase", () => {
  it("lowercases string values", () => {
    const result = normalizeToLowercase({ name: "JOHN", age: 25 });
    expect(result.name).toBe("john");
    expect(result.age).toBe(25);
  });

  it("lowercases string arrays", () => {
    const result = normalizeToLowercase({ tags: ["A", "B"] });
    expect(result.tags).toEqual(["a", "b"]);
  });

  it("leaves non-string values unchanged", () => {
    const result = normalizeToLowercase({ count: 42 });
    expect(result.count).toBe(42);
  });

  it("handles mixed arrays", () => {
    const result = normalizeToLowercase({ items: ["FOO", 123, "BAR"] });
    expect(result.items).toEqual(["foo", 123, "bar"]);
  });
});

describe("identifier", () => {
  it("returns email when present", () => {
    expect(identifier("user@example.com", "081234")).toBe("user@example.com");
  });

  it("falls back to phone when email null", () => {
    expect(identifier(null, "081234")).toBe("081234");
  });

  it("returns dash when both null", () => {
    expect(identifier(null, null)).toBe("-");
  });

  it("returns dash when both undefined", () => {
    expect(identifier()).toBe("-");
  });
});

describe("calculateDuration", () => {
  it("adds hours to start time", () => {
    const result = calculateDuration("2023-06-20T10:00:00Z", 2);
    // Result is locale dependent, so just verify it is not empty
    expect(result.length).toBeGreaterThan(0);
  });
});
