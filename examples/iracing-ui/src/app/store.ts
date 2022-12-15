import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as iRacingReducer } from "@racedirector/iracing-socket-js";
import driversReducer from "../features/driversSlice";
import fuelReducer from "../features/fuelSlice";
import paceAnalysisReducer from "../features/paceAnalysisSlice";
import pitStopAnalysisReducer from "../features/pitStopAnalysisSlice";
import raceEventsReducer from "../features/raceEventsSlice";
import simIncidentsReducer from "../features/simIncidentsSlice";
import sessionPaceReducer from "../features/sessionPaceSlice";
import { listenerMiddleware } from "./middleware";
import { api } from "./api";

const combinedReducers = combineReducers({
  drivers: driversReducer,
  fuel: fuelReducer,
  sessionPace: sessionPaceReducer,
  paceAnalysis: paceAnalysisReducer,
  pitStopAnalysis: pitStopAnalysisReducer,
  raceEvents: raceEventsReducer,
  simIncidents: simIncidentsReducer,
  iRacing: iRacingReducer,
  // telemetryIncidents: telemetryIncidentsReducer,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof combinedReducers>;
export type AppDispatch = typeof store.dispatch;

const compareStateChanges = (previousState, nextState, action): RootState => {
  return nextState;
};

const rootReducer = (state, action): RootState => {
  const nextState = combinedReducers(state, action);
  const finalState = compareStateChanges(state, nextState, action);
  return finalState;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(api.middleware),
});

export default store;
