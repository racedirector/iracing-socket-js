import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useMemo } from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useIRacingState: () => RootState["iRacing"] = () =>
  useAppSelector((state) => state.iRacing);

export const useIRacingConnectionState = () => {
  const iRacingState = useIRacingState();

  return useMemo(
    () => ({
      isIRacingConnected: iRacingState.isIRacingConnected,
      isSocketConnected: iRacingState.isSocketConnected,
    }),
    [iRacingState.isIRacingConnected, iRacingState.isSocketConnected],
  );
};
