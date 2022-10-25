import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

// !!!: This is copy-pasta from `averagePaceSlice`
const averageLapTimes = (lapTimes: number[]) => {
  const minLapTime = 2 + Math.min.apply(null, lapTimes);

  const validLaps = lapTimes.filter((lapTime) => lapTime < minLapTime);

  const totalLapTime = validLaps.reduce(
    (aggregateLapTimes, lapTime) => aggregateLapTimes + lapTime,
  );

  return totalLapTime / validLaps.length;
};

export interface PaceAnalysisState {
  lapTimeLimit: number;
  targetLapTimes: Record<string, number[]>;
}

const initialState: PaceAnalysisState = {
  lapTimeLimit: 10,
  targetLapTimes: {},
};

export const paceAnalysisSlice = createSlice({
  name: "paceAnalysis",
  initialState,
  reducers: {
    setLapTimeLimit: (state, action: PayloadAction<number>) => {
      state.lapTimeLimit = action.payload;
    },
    addTargetLapTimes: (
      state,
      action: PayloadAction<Record<string, number>>,
    ) => {
      Object.entries(action.payload).forEach(([carIndex, lapTime]) => {
        const lapTimes = state.targetLapTimes[carIndex] || [];
        lapTimes.push(lapTime);
        while (lapTimes.length > state.lapTimeLimit) lapTimes.shift();
        state.targetLapTimes[carIndex] = lapTimes;
      });
    },
  },
});

export const { setLapTimeLimit, addTargetLapTimes } = paceAnalysisSlice.actions;

export const selectPaceAnalysis = (state: RootState) => state.paceAnalysis;

export const selectAverageLapTimesForTargets = (
  state: RootState,
): Record<string, number> => {
  return Object.entries(state.paceAnalysis.targetLapTimes).reduce(
    (lapTimeIndex, [carIndex, lapTimes]) => {
      return {
        ...lapTimeIndex,
        [carIndex]: averageLapTimes(lapTimes),
      };
    },
    {},
  );
};

export const selectAverageLapTimeForSession = (state: RootState) => {
  const averageLapTimes = selectAverageLapTimesForTargets(state);
  const lapTimes = Object.values(averageLapTimes);
  const totalLapTime = lapTimes.reduce(
    (totalLapTime, averageLapTime) => totalLapTime + averageLapTime,
    0,
  );

  return totalLapTime / lapTimes.length;
};

export const selectLastLapTimesForTargets = (state: RootState) => {
  return Object.entries(state.paceAnalysis.targetLapTimes).reduce(
    (lapTimeIndex, [carIndex, lapTimes]) => {
      return {
        ...lapTimeIndex,
        [carIndex]: lapTimes[lapTimes.length - 1],
      };
    },
    {},
  );
};

export const selectTimeGainedAgainstField =
  (driverCarIndex: number) => (state: RootState) => {
    if (driverCarIndex < 0) {
      return;
    }

    const { [driverCarIndex.toString()]: driverCarPace, ...rest } =
      selectAverageLapTimesForTargets(state);

    return Object.entries(rest).reduce((gainIndex, [carIndex, averagePace]) => {
      return {
        ...gainIndex,
        [carIndex]: driverCarPace - averagePace,
      };
    }, {});
  };

export const selectTimeGainedAgainstTarget =
  (comparisonIndex: string, carIndex: string) => (state: RootState) => {
    const comparisonPace = averageLapTimes(
      state.paceAnalysis.targetLapTimes?.[comparisonIndex] || [],
    );

    const targetPace = averageLapTimes(
      state.paceAnalysis.targetLapTimes?.[carIndex] || [],
    );

    console.log(
      `Pace gained: ${comparisonPace} - ${targetPace} = ${
        comparisonPace - targetPace
      }`,
    );
    return comparisonPace - targetPace;
  };

export default paceAnalysisSlice.reducer;
