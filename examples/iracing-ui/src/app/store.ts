import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
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

export const store = configureStore({
  reducer: {
    fuel: fuelReducer,
    sessionPace: sessionPaceReducer,
    paceAnalysis: paceAnalysisReducer,
    pitStopAnalysis: pitStopAnalysisReducer,
    simIncidents: simIncidentsReducer,
    team: teamReducer,
    iRacing: iRacingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      logger,
      createIRacingSocketMiddleware({
        requestParameters: [
          "CameraInfo",
          "CarSetup",
          "DriverInfo",
          "QualifyResultsInfo",
          "RadioInfo",
          "SessionInfo",
          "SplitTimeInfo",
          "WeekendInfo",
          "__all_telemetry__",
        ],
      }),
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectIRacingState = (state: RootState) => state.iRacing;

export default store;
