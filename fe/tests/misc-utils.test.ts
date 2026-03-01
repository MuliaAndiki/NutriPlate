import { describe, expect, it } from "bun:test";
const GenderFormat = (gender: boolean | undefined | null) => {
  return gender === true ? "Pria" : "Perempuan";
};

function isPolarViewBox(
  viewBox: unknown,
): viewBox is { cx: number; cy: number } {
  return (
    typeof viewBox === "object" &&
    viewBox !== null &&
    "cx" in viewBox &&
    "cy" in viewBox &&
    typeof (viewBox as any).cx === "number" &&
    typeof (viewBox as any).cy === "number"
  );
}

describe("GenderFormat (boolean)", () => {
  it("returns Pria for true", () => {
    expect(GenderFormat(true)).toBe("Pria");
  });

  it("returns Perempuan for false", () => {
    expect(GenderFormat(false)).toBe("Perempuan");
  });

  it("returns Perempuan for undefined", () => {
    expect(GenderFormat(undefined)).toBe("Perempuan");
  });

  it("returns Perempuan for null", () => {
    expect(GenderFormat(null)).toBe("Perempuan");
  });
});

describe("isPolarViewBox", () => {
  it("returns true for valid viewBox", () => {
    expect(isPolarViewBox({ cx: 100, cy: 200 })).toBe(true);
  });

  it("returns false for null", () => {
    expect(isPolarViewBox(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPolarViewBox(undefined)).toBe(false);
  });

  it("returns false for string", () => {
    expect(isPolarViewBox("hello")).toBe(false);
  });

  it("returns false when missing cx", () => {
    expect(isPolarViewBox({ cy: 100 })).toBe(false);
  });

  it("returns false when cx is string", () => {
    expect(isPolarViewBox({ cx: "100", cy: 200 })).toBe(false);
  });

  it("returns true with extra properties", () => {
    expect(isPolarViewBox({ cx: 1, cy: 2, extra: "ok" })).toBe(true);
  });
});
