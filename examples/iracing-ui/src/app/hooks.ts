import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useMemo } from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useIRacingContext: () => RootState["iRacing"] = () =>
  useAppSelector((state) => state.iRacing);

export const useIRacingConnectionState = () => {
  const { isIRacingConnected, isSocketConnected } = useIRacingContext();

  return useMemo(
    () => ({
      isIRacingConnected,
      isSocketConnected,
    }),
    [isIRacingConnected, isSocketConnected],
  );
};
