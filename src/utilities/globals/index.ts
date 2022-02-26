export { InvariantError, invariant } from "ts-invariant";

export const canUseSymbol =
  typeof Symbol === "function" && typeof Symbol.for === "function";
