import React, { PropsWithChildren } from "react";
import {
  selectStrengthOfField,
  selectStrengthOfFieldByClass,
} from "@racedirector/iracing-socket-js";
import { StrengthOfFieldContext } from "./context";
import { useAppSelector } from "src/app/hooks";

export interface StrengthOfFieldProviderProps {}

export const StrengthOfFieldProvider: React.FC<
  PropsWithChildren<StrengthOfFieldProviderProps>
> = ({ children = null }) => {
  const strengthOfField = useAppSelector(({ iRacing }) =>
    selectStrengthOfFieldByClass(iRacing),
  );

  const totalStrengthOfField = useAppSelector(({ iRacing }) =>
    selectStrengthOfField(iRacing),
  );

  return (
    <StrengthOfFieldContext.Provider
      value={{
        totalStrengthOfField,
        strengthOfField,
      }}
    >
      {children}
    </StrengthOfFieldContext.Provider>
  );
};

export default StrengthOfFieldProvider;
