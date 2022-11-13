import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./middleware";
import fuelReducer from "../features/fuelSlice";
import sessionPaceReducer from "../features/sessionPaceSlice";
import paceAnalysisReducer from "../features/paceAnalysisSlice";
import pitStopAnalysisReducer from "../features/pitStopAnalysisSlice";
import teamReducer from "../features/teamSlice";
import simIncidentsReducer from "../features/simIncidentsSlice";
import {
  createIRacingSocketMiddleware,
  reducer as iRacingReducer,
} from "@racedirector/iracing-socket-js";

const rootReducer = combineReducers({
  fuel: fuelReducer,
  sessionPace: sessionPaceReducer,
  paceAnalysis: paceAnalysisReducer,
  pitStopAnalysis: pitStopAnalysisReducer,
  simIncidents: simIncidentsReducer,
  team: teamReducer,
  iRacing: iRacingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(createIRacingSocketMiddleware()),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;