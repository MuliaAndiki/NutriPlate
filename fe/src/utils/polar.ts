export function isPolarViewBox(
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
