import { Reducer } from "react";

export type RaceTime = number | "unlimited";

export interface RaceLengthState {
  sessionLaps: number;
  raceLaps: number;
  lengthInSeconds: RaceTime;
}

export const initialState: RaceLengthState = {
  sessionLaps: -1,
  raceLaps: -1,
  lengthInSeconds: "unlimited",
};

export enum RaceLengthActionType {
  SET_SESSION_LAPS = "SET_SESSION_LAPS",
  SET_RACE_LAPS = "SET_RACE_LAPS",
  SET_RACE_TIME = "SET_RACE_TIME",
  SET_ESTIMATED_LAPS = "SET_ESTIMATED_LAPS",
}

interface SetSessionLapsAction {
  type: RaceLengthActionType.SET_SESSION_LAPS;
  payload: number;
}

interface SetRaceLapsAction {
  type: RaceLengthActionType.SET_RACE_LAPS;
  payload: number;
}

interface SetRaceTimeAction {
  type: RaceLengthActionType.SET_RACE_TIME;
  payload: RaceTime;
}

interface SetEstimatedLapsAction {
  type: RaceLengthActionType.SET_ESTIMATED_LAPS;
  payload: number;
}

export type RaceLengthAction =
  | SetRaceLapsAction
  | SetRaceTimeAction
  | SetSessionLapsAction
  | SetEstimatedLapsAction;

export const reducer: Reducer<RaceLengthState, RaceLengthAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case RaceLengthActionType.SET_RACE_LAPS:
      return { ...state, raceLaps: action.payload };
    case RaceLengthActionType.SET_SESSION_LAPS:
      return { ...state, sessionLaps: action.payload };
    case RaceLengthActionType.SET_RACE_TIME:
      return { ...state, lengthInSeconds: action.payload };
    case RaceLengthActionType.SET_ESTIMATED_LAPS:
      return {
        ...state,
        sessionLaps: action.payload,
        raceLaps: action.payload,
      };
    default:
      return state;
  }
};
