import { describe, expect, it } from "bun:test";

function parsePayload<T extends Record<string, unknown>>(
  original: T,
  current: T,
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

describe("parsePayload", () => {
  it("returns only changed fields", () => {
    const original = { name: "Alice", age: 25 };
    const current = { name: "Alice", age: 26 };
    const result = parsePayload(original, current);
    expect(result).toEqual({ age: 26 });
  });

  it("ignores null values in current", () => {
    const original = { name: "Alice", bio: "hello" } as any;
    const current = { name: "Alice", bio: null } as any;
    const result = parsePayload(original, current);
    expect(result).toEqual({});
  });

  it("ignores undefined values in current", () => {
    const original = { name: "Alice" } as any;
    const current = { name: "Alice", extra: undefined } as any;
    const result = parsePayload(original, current);
    expect(result).toEqual({});
  });

  it("ignores empty strings", () => {
    const original = { name: "Alice" };
    const current = { name: "   " };
    const result = parsePayload(original, current);
    expect(result).toEqual({});
  });

  it("returns empty when nothing changed", () => {
    const original = { name: "Alice", age: 25 };
    const current = { name: "Alice", age: 25 };
    const result = parsePayload(original, current);
    expect(result).toEqual({});
  });

  it("detects all fields changed", () => {
    const original = { name: "Alice", age: 25 };
    const current = { name: "Bob", age: 30 };
    const result = parsePayload(original, current);
    expect(result).toEqual({ name: "Bob", age: 30 });
  });

  it("detects new fields in current", () => {
    const original = { name: "Alice" } as any;
    const current = { name: "Alice", phone: "0812" } as any;
    const result = parsePayload(original, current);
    expect(result).toEqual({ phone: "0812" });
  });
});
