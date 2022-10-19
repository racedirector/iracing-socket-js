import { Reducer } from "react";

export type ClassAveragePaceState = {
  lapsComplete: number;
  lapTimes: number[];
  averageLapTime: number;
  sessionLaps: number;
  sessionTimeRemaining: number;
};

const classAveragePaceInitialState: ClassAveragePaceState = {
  lapsComplete: 0,
  lapTimes: [],
  averageLapTime: -1,
  sessionLaps: -1,
  sessionTimeRemaining: -1,
};

enum ClassAveragePaceActionType {
  SET_LAPS_COMPLETE = "SET_LAPS_COMPLETE",
  ADD_LAP_TIME = "ADD_LAP_TIME",
  SET_FASTEST_CLASS = "SET_FASTEST_CLASS",
}

interface SetLapsCompleteAction {
  type: ClassAveragePaceActionType.SET_LAPS_COMPLETE;
  payload: number;
}

interface AddLapTimeAction {
  type: ClassAveragePaceActionType.ADD_LAP_TIME;
  payload: {
    sessionTimeRemaining: number;
    lapTime: number;
    fastestClass?: ClassAveragePaceState;
  };
}

interface SetFastestClassAction {
  type: ClassAveragePaceActionType.SET_FASTEST_CLASS;
  payload: ClassAveragePaceState;
}

type ClassAveragePaceAction =
  | SetLapsCompleteAction
  | AddLapTimeAction
  | SetFastestClassAction;

const MAX_LAP_TIMES = 5;

const classAveragePaceReducer: Reducer<
  ClassAveragePaceState,
  ClassAveragePaceAction
> = (state, action) => {
  switch (action.type) {
    case ClassAveragePaceActionType.SET_LAPS_COMPLETE:
      return { ...state, lapsComplete: action.payload };
    case ClassAveragePaceActionType.ADD_LAP_TIME: {
      const { lapTime, sessionTimeRemaining, fastestClass } = action.payload;

      const nextLapTimes = [...state.lapTimes, lapTime];

      while (nextLapTimes.length > MAX_LAP_TIMES) nextLapTimes.shift();

      const minLapTime = 2 + Math.min.apply(null, nextLapTimes);

      const validLaps = nextLapTimes.filter((lapTime) => lapTime < minLapTime);

      const totalLapTime = validLaps.reduce(
        (aggregateLapTimes, lapTime) => aggregateLapTimes + lapTime,
      );

      const averageLapTime = totalLapTime / validLaps.length;

      let sessionLaps =
        state.lapsComplete + (sessionTimeRemaining + 5) / averageLapTime;

      if (fastestClass) {
        const timeRemaining =
          Math.ceil(fastestClass.sessionLaps - fastestClass.lapsComplete) *
          fastestClass.averageLapTime;

        const fastestClassOffset =
          fastestClass.sessionTimeRemaining - state.sessionTimeRemaining;

        const estimatedTimeRemaining = timeRemaining - fastestClassOffset;
        const normalizedTimeRemaining = Math.max(1, estimatedTimeRemaining);

        const estimatedLapsRemaining =
          normalizedTimeRemaining / state.averageLapTime;

        // Round up
        sessionLaps = Math.floor(
          state.lapsComplete + estimatedLapsRemaining + 0.5,
        );
      }

      return {
        ...state,
        averageLapTime,
        sessionLaps,
        lapTimes: nextLapTimes,
        sessionTimeRemaining,
      };
    }
    default:
      return state;
  }
};

export interface RacePaceState {
  sessionTimeRemaining: number;
  classes: Record<string, ClassAveragePaceState>;
}

export const initialState: RacePaceState = {
  sessionTimeRemaining: -1,
  classes: {},
};

export enum RacePaceActionType {
  SET_LAPS_COMPLETE = "SET_LAPS_COMPLETE",
  ADD_LAP_TIME = "ADD_LAP_TIME",
  SET_FASTEST_CLASS = "SET_FASTEST_CLASS",
}

interface SetClassLapsCompleteAction {
  type: RacePaceActionType.SET_LAPS_COMPLETE;
  payload: {
    classId: string;
    lapsComplete: number;
  };
}

interface AddClassLapTimeAction {
  type: RacePaceActionType.ADD_LAP_TIME;
  payload: AddLapTimeAction["payload"] & {
    classId: string;
    fastestClass?: ClassAveragePaceState;
  };
}

interface SetTimeRemainingAction {
  type: RacePaceActionType.SET_FASTEST_CLASS;
}

export type RacePaceAction =
  | SetClassLapsCompleteAction
  | AddClassLapTimeAction
  | SetTimeRemainingAction;

export const reducer: Reducer<RacePaceState, RacePaceAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case RacePaceActionType.SET_LAPS_COMPLETE:
      return {
        ...state,
        classes: {
          ...state.classes,
          [action.payload.classId]: classAveragePaceReducer(
            state.classes?.[action.payload.classId] ||
              classAveragePaceInitialState,
            {
              type: ClassAveragePaceActionType.SET_LAPS_COMPLETE,
              payload: action.payload.lapsComplete,
            },
          ),
        },
      };
    case RacePaceActionType.ADD_LAP_TIME:
      return {
        ...state,
        sessionTimeRemaining: action.payload.sessionTimeRemaining,
        classes: {
          ...state.classes,
          [action.payload.classId]: classAveragePaceReducer(
            state.classes?.[action.payload.classId] ||
              classAveragePaceInitialState,
            {
              type: ClassAveragePaceActionType.ADD_LAP_TIME,
              payload: action.payload,
            },
          ),
        },
      };
    default:
      return state;
  }
};
