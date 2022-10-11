import { useContext, createContext } from "react";

export interface StrengthOfFieldContextType {
  totalStrengthOfField: number;
  strengthOfField: {
    [key: string]: number;
  };
}

export const StrengthOfFieldContext =
  createContext<StrengthOfFieldContextType>(null);
StrengthOfFieldContext.displayName = "StrengthOfFieldContext";

export const useStrengthOfFieldContext = () =>
  useContext(StrengthOfFieldContext);
