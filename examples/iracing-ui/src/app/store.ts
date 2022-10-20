import { configureStore } from "@reduxjs/toolkit";
import raceLengthReducer from "../features/raceLengthSlice";
import fuelReducer from "../features/fuelSlice";
import sessionPaceReducer from "../features/sessionPaceSlice";
// import raceStrategyReducer from "../features/raceStrategySlice";

export const store = configureStore({
  reducer: {
    raceLength: raceLengthReducer,
    fuel: fuelReducer,
    sessionPace: sessionPaceReducer,
    // raceStrategy: raceStrategyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
