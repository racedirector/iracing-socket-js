import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import averagePaceReducer, {
  addLapTime,
  AveragePaceState,
  setLapsComplete,
  setLapTimes,
} from "./averagePaceSlice";
import { omit } from "lodash";
import { RootState } from "src/app/store";

export interface SessionPaceState {
  [classId: string]: AveragePaceState;
}

const initialState: SessionPaceState = {};

interface SetLapsCompleteForClassPayload {
  classId: string;
  lapsComplete: number;
}

interface SetLapTimesForClassPayload {
  classId: string;
  sessionTimeRemaining: number;
  lapTimes: number[];
}

interface AddLapTimeForClassPayload {
  classId: string;
  sessionTimeRemaining: number;
  lapTime: number;
}

export const sessionPaceSlice = createSlice({
  name: "sessionPace",
  initialState,
  reducers: {
    setLapsCompleteForClass: (
      state,
      action: PayloadAction<SetLapsCompleteForClassPayload>,
    ) => {
      state[action.payload.classId] = averagePaceReducer(
        state[action.payload.classId],
        setLapsComplete(action.payload.lapsComplete),
      );
    },
    setLapTimesForClass: (
      state,
      action: PayloadAction<SetLapTimesForClassPayload>,
    ) => {
      state[action.payload.classId] = averagePaceReducer(
        state[action.payload.classId],
        setLapTimes(omit(action.payload, "classId")),
      );
    },
    addLapTimeForClass: (
      state,
      action: PayloadAction<AddLapTimeForClassPayload>,
    ) => {
      state[action.payload.classId] = averagePaceReducer(
        state[action.payload.classId],
        addLapTime(omit(action.payload, "classId")),
      );
    },
  },
});

export const {
  setLapsCompleteForClass,
  setLapTimesForClass,
  addLapTimeForClass,
} = sessionPaceSlice.actions;

export const selectSessionPace = (state: RootState) => state.sessionPace;

export default sessionPaceSlice.reducer;
