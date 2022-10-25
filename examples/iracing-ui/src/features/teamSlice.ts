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
    addDriver: () => {},
  },
});

export const { addDriver } = teamSlice.actions;

export const selectTeamStrengthOfField =
  (carIndex: number) => (state: TeamState) => {};

export default teamSlice.reducer;
