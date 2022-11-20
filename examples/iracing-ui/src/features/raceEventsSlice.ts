import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import { Flags, SessionState } from "@racedirector/iracing-socket-js";
import { flagsChanged, sessionStateChanged } from "src/app/actions";
import { RootState } from "src/app/store";

type RaceEventType =
  | "parade"
  | "race_start"
  | "green"
  | "caution_start"
  | "caution"
  | "white"
  | "checkered"
  | "cooldown";

interface RaceEvent {
  id: string;
  type: RaceEventType;
  sessionTime: number;
}

const raceEventsAdapter = createEntityAdapter<RaceEvent>({
  selectId: ({ id }) => id,
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
        const { currentFlags, previousFlags, sessionTime } = action.payload;
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
            sessionTime,
          });
        }

        if (isCautionStart) {
          raceEventsAdapter.addOne(state, {
            id: nanoid(),
            type: "caution_start",
            sessionTime,
          });
        }

        if (isCaution) {
          raceEventsAdapter.addOne(state, {
            id: nanoid(),
            type: "caution",
            sessionTime,
          });
        }
      })
      .addCase(sessionStateChanged, (state, action) => {
        const { currentSessionState, sessionTime } = action.payload;
        switch (currentSessionState) {
          case SessionState.ParadeLaps:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "parade",
              sessionTime,
            });
            break;
          case SessionState.Racing:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "race_start",
              sessionTime,
            });
            break;

          case SessionState.Checkered:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "checkered",
              sessionTime,
            });
            break;
          case SessionState.CoolDown:
            raceEventsAdapter.addOne(state, {
              id: nanoid(),
              type: "cooldown",
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

export const allRaceEvents = raceEventsSelectors.selectAll;
export const raceEventsByType = (state: RootState, type: RaceEventType) =>
  allRaceEvents(state).filter(
    ({ type: raceEventType }) => raceEventType === type,
  );

export const lastGreenFlagRunLength = () => {};
export const lastCautionLength = () => {};
export const totalCautionLength = () => {};
export const totalGreenFlagLength = () => {};
export const totalRaceLength = () => {};

export default raceEventsSlice.reducer;
