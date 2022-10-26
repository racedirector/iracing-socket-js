import { createContext } from "react";

export const metersPerSecondToKilometersPerHour = (mps: number) => mps * 3.6;

export const getContextKey = (key: string) => {
  return typeof Symbol === "function" && typeof Symbol.for === "function"
    ? Symbol.for(key)
    : key;
};

export function getContext<T>(
  key: string | symbol,
  initialContext?: T,
): React.Context<T> {
  let context = (createContext as any)[key] as React.Context<T>;
  if (!context) {
    Object.defineProperty(createContext, key, {
      value: (context = createContext<T>(initialContext)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }

  return context;
}
