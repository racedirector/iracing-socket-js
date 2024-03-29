import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import { Flags, SessionState } from "@racedirector/iracing-socket-js";
import { flagsChanged, sessionStateChanged } from "src/app/actions";
import { RootState } from "src/app/store";
import { sortSessionEvents } from "src/utils";

type RaceEventType =
  | "parade"
  | "race_start"
  | "green"
  | "caution_start"
  | "caution"
  | "white"
  | "checkered"
  | "cooldown";

export interface RaceEvent {
  id: string;
  type: RaceEventType;
  sessionTime: number;
  sessionNumber: number;
}

const raceEventsAdapter = createEntityAdapter<RaceEvent>({
  selectId: ({ id }) => id,
  sortComparer: sortSessionEvents,
});

const raceEventsSlice = createSlice({
  name: "flagEvents",
  initialState: raceEventsAdapter.getInitialState(),
  reducers: {
    raceEventAdded: raceEventsAdapter.addOne,
  },
  extraReducers: (builder) =>
    builder
      .addCase(flagsChanged, (state, action) => {
        const { currentFlags, previousFlags, sessionTime, sessionNumber } =
          action.payload;
        const isCautionStart =
          currentFlags & Flags.CautionWaving &&
          !(previousFlags & Flags.CautionWaving);
        const isCaution =
          currentFlags & Flags.Caution && !(previousFlags & Flags.Caution);

        const isGreenFlag =
          (currentFlags & Flags.StartGo && !(previousFlags & Flags.StartGo)) ||
          (currentFlags & Flags.Green && !(previousFlags & Flags.Green));

        if (isGreenFlag) {
          raceEventsAdapter.addOne(state, {
            id: nanoid(),
            type: "green",
            sessionNumber,
            sessionTime,
          });
        }

        if (isCautionStart) {
          raceEventsAdapter.addOne(state, {
            id: nanoid(),
            type: "caution_start",
            sessionNumber,
            sessionTime,
          });
        }

        if (isCaution) {
          raceEventsAdapter.addOne(state, {
            id: nanoid(),
            type: "caution",
            sessionNumber,
            sessionTime,
          });
        }
      })
      .addCase(sessionStateChanged, (state, action) => {
        const { currentSessionState, sessionTime, sessionNumber } =
          action.payload;
        switch (currentSessionState) {
          case SessionState.ParadeLaps:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "parade",
              sessionNumber,
              sessionTime,
            });
            break;
          case SessionState.Racing:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "race_start",
              sessionNumber,
              sessionTime,
            });
            break;

          case SessionState.Checkered:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "checkered",
              sessionNumber,
              sessionTime,
            });
            break;
          case SessionState.CoolDown:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "cooldown",
              sessionNumber,
              sessionTime,
            });
            break;
          default:
            break;
        }
      }),
});

const raceEventsSelectors = raceEventsAdapter.getSelectors<RootState>(
  (state) => state.raceEvents,
);

export const selectAllRaceEvents = raceEventsSelectors.selectAll;
export const selectRaceEventsByType = (state: RootState, type: RaceEventType) =>
  selectAllRaceEvents(state).filter(
    ({ type: raceEventType }) => raceEventType === type,
  );

export const selectRaceEventsBySessionNumber = (
  state: RootState,
  sessionNumber: number,
) =>
  selectAllRaceEvents(state).filter(
    ({ sessionNumber: raceEventSessionNumber }) =>
      raceEventSessionNumber === sessionNumber,
  );

export const selectLastFlagSessionTime = (
  state: RootState,
  eventType: RaceEventType,
) => selectRaceEventsByType(state, eventType).pop();

export const selectLastGreenFlagSessionTime = (state: RootState) =>
  selectLastFlagSessionTime(state, "green");

const lastGreenFlagRunLength = () => {};
const lastCautionLength = () => {};
const totalCautionLength = () => {};
const totalGreenFlagLength = () => {};
const totalRaceLength = () => {};

export default raceEventsSlice.reducer;
