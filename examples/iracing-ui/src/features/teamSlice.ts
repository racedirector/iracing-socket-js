import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "@racedirector/iracing-socket-js";

export interface TeamState {
  [carIndex: string]: Driver[];
}

const initialState: TeamState = {};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    addDriver: (state, action: PayloadAction<Driver>) => {
      const existingTeamDrivers = state[action.payload.CarIdx] || [];
      state[action.payload.CarIdx] = [...existingTeamDrivers, action.payload];
    },
  },
});

export const { addDriver } = teamSlice.actions;

export const selectTeamStrengthOfField =
  (carIndex: number) => (state: TeamState) => {};

export default teamSlice.reducer;
