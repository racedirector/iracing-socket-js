import { configureStore } from "@reduxjs/toolkit";
import fuelReducer from "../features/fuelSlice";
import sessionPaceReducer from "../features/sessionPaceSlice";
import paceAnalysisReducer from "../features/paceAnalysisSlice";
import pitStopAnalysisReducer from "../features/pitStopAnalysis";
import teamReducer from "../features/teamSlice";
// import raceStrategyReducer from "../features/raceStrategySlice";

export const store = configureStore({
  reducer: {
    fuel: fuelReducer,
    sessionPace: sessionPaceReducer,
    paceAnalysis: paceAnalysisReducer,
    pitStopAnalysis: pitStopAnalysisReducer,
    team: teamReducer,
    // raceStrategy: raceStrategyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
