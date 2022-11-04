import {
  AnyAction,
  createSelector,
  createSlice,
  ListenerEffect,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "src/app/store";
import {
  Flags,
  selectActiveDriversByCarIndex,
} from "@racedirector/iracing-socket-js";
import {
  activeDriversDidChangePredicate,
  startAppListening,
} from "src/app/middleware";

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

const incidentFilters = {
  includePaceCar: false,
  includeAI: true,
  includeSpectators: false,
};

export const checkIncidentsEffect: ListenerEffect<
  AnyAction,
  RootState,
  AppDispatch
> = (_action, listenerApi) => {
  const currentState = listenerApi.getState();
  const previousState = listenerApi.getOriginalState();

  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState.iRacing,
    incidentFilters,
  );
  const previousActiveDrivers = selectActiveDriversByCarIndex(
    previousState.iRacing,
    incidentFilters,
  );

  const {
    data: {
      CarIdxSessionFlags = [],
      CarIdxLapDistPct = [],
      SessionNum,
      SessionTime,
      SessionTimeOfDay,
    } = {},
  } = currentState.iRacing;

  Object.entries(currentActiveDrivers).forEach(([carIndex, driver]) => {
    const existingDriver = previousActiveDrivers?.[carIndex] || null;

    // !!!: Ensuring that the driver exists and matches the current user ID
    //      ensures that incidents are processed iff we already know what drivers
    //      are on track.
    if (existingDriver && existingDriver.UserID === driver.UserID) {
      const incidentCount =
        driver.CurDriverIncidentCount - existingDriver.CurDriverIncidentCount;

      if (incidentCount > 0) {
        listenerApi.dispatch(
          addIncident({
            carIndex: parseInt(carIndex),
            value: incidentCount,
            sessionFlags: CarIdxSessionFlags?.[carIndex] || 0x0,
            lapPercentage: CarIdxLapDistPct?.[carIndex] || -1,
            sessionNumber: SessionNum,
            sessionTime: SessionTime,
            sessionTimeOfDay: SessionTimeOfDay,
            driverId: driver.UserID,
          }),
        );
      }
    }
  });
};

startAppListening({
  predicate: activeDriversDidChangePredicate,
  effect: checkIncidentsEffect,
});

export default simIncidentsSlice.reducer;
