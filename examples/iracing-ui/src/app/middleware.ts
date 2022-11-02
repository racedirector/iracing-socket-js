import { createListenerMiddleware, addListener } from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import { resetLap } from "src/features/fuelSlice";
import { Flags } from "@racedirector/iracing-socket-js";

export const listenerMiddleware = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

// Fuel middleware things...

const flagsResetLap = (flags: Flags) => {
  const randomWaving = flags & Flags.RandomWaving;
  const shouldLapReset =
    flags &
    (Flags.GreenHeld | Flags.Caution | Flags.CautionWaving | Flags.Furled);
  return randomWaving && shouldLapReset;
};

startAppListening({
  predicate: (action, currentState, previousState) => {
    const currentFlags = currentState.iRacing.data?.SessionFlags;
    const previousFlags = previousState.iRacing.data?.SessionFlags;

    const result: boolean =
      currentFlags !== previousFlags && flagsResetLap(currentFlags);
    return result;
  },
  effect: (action, listenerApi) => {
    listenerApi.dispatch(resetLap());
  },
});
