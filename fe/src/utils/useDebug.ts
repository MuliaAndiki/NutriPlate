import { useEffect } from "react";

type DebugOptions = {
  label?: string;
  enabled?: boolean;
};

export function useDebugLog<T>(
  value: T,
  deps: any[] = [],
  options?: DebugOptions,
) {
  const { label = "DEBUG", enabled = true } = options || {};

  useEffect(() => {
    if (!enabled) return;

    console.group(` ${label}`);
    console.log(value);
    console.groupEnd();
  }, deps);
}
