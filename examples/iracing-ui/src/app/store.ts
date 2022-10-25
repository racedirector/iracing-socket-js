import { configureStore } from "@reduxjs/toolkit";
import fuelReducer from "../features/fuelSlice";
import sessionPaceReducer from "../features/sessionPaceSlice";
import paceAnalysisReducer from "../features/paceAnalysisSlice";
import pitStopAnalysisReducer from "../features/pitStopAnalysisSlice";
import teamReducer from "../features/teamSlice";

export const store = configureStore({
  reducer: {
    fuel: fuelReducer,
    sessionPace: sessionPaceReducer,
    paceAnalysis: paceAnalysisReducer,
    pitStopAnalysis: pitStopAnalysisReducer,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
