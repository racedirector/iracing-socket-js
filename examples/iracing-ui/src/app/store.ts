import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
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
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat([
        logger,
        createIRacingSocketMiddleware({
          server: "192.168.4.52:8182",
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

export default store;
