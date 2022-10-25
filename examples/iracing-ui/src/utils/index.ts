export const metersPerSecondToKilometersPerHour = (mps: number) => mps * 3.6;

export const getContextKey = (key: string) => {
  return typeof Symbol === "function" && typeof Symbol.for === "function"
    ? Symbol.for(key)
    : key;
};
