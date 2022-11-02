import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/app/store";
import { Flags } from "@racedirector/iracing-socket-js";

export interface SimIncidentEvent {
  value: number;
  sessionFlags: Flags;
  lapPercentage: number;
  sessionNumber: number;
  sessionTime: number;
  sessionTimeOfDay: number;
  driverId: number;
  carIndex: number;
}

export interface SimIncidentsState {
  maxSimIncidentWeight: number;
  incidents: SimIncidentEvent[];
}

const initialState: SimIncidentsState = {
  maxSimIncidentWeight: 2,
  incidents: [],
};

interface AddIncidentPayload extends SimIncidentEvent {}

export const simIncidentsSlice = createSlice({
  name: "simIncidents",
  initialState,
  reducers: {
    setMaxSimIncidentWeight: (state, action: PayloadAction<number>) => {
      state.maxSimIncidentWeight = action.payload;
    },
    addIncident: (state, action: PayloadAction<AddIncidentPayload>) => {
      state.incidents.push(action.payload);
    },
  },
});

export const { setMaxSimIncidentWeight, addIncident } =
  simIncidentsSlice.actions;

export const selectSimIncidents = (state: RootState) => state.simIncidents;
export const selectMaxSimIncidentWeight = (state: RootState) =>
  selectSimIncidents(state).maxSimIncidentWeight;
export const selectAllIncidents = (state: RootState) =>
  selectSimIncidents(state).incidents;

export const selectSimIncidentsForDriver = createSelector(
  [selectAllIncidents, (_state, driverId: number) => driverId],
  (incidents, driverId) =>
    incidents.filter(
      ({ driverId: incidentDriverId }) => incidentDriverId === driverId,
    ),
);

export const selectSimIncidentsForCarIndex = createSelector(
  [selectAllIncidents, (_state, carIndex: number) => carIndex],
  (incidents, carIndex) =>
    incidents.filter(
      ({ carIndex: incidentCarIndex }) => incidentCarIndex === carIndex,
    ),
);

export default simIncidentsSlice.reducer;
