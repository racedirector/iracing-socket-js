import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware";
import fuelReducer from "../features/fuelSlice";
import sessionPaceReducer from "../features/sessionPaceSlice";
import paceAnalysisReducer from "../features/paceAnalysisSlice";
import pitStopAnalysisReducer from "../features/pitStopAnalysisSlice";
import simIncidentsReducer from "../features/simIncidentsSlice";
import driversReducer from "../features/driversSlice";
import raceEventsReducer from "../features/raceEventsSlice";
import { fuelClientApi } from "./fuelClientApi";
import {
  createIRacingSocketMiddleware,
  reducer as iRacingReducer,
} from "@racedirector/iracing-socket-js";

const rootReducer = combineReducers({
  drivers: driversReducer,
  fuel: fuelReducer,
  sessionPace: sessionPaceReducer,
  paceAnalysis: paceAnalysisReducer,
  pitStopAnalysis: pitStopAnalysisReducer,
  raceEvents: raceEventsReducer,
  simIncidents: simIncidentsReducer,
  iRacing: iRacingReducer,
  [fuelClientApi.reducerPath]: fuelClientApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat([fuelClientApi.middleware, createIRacingSocketMiddleware()]),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
