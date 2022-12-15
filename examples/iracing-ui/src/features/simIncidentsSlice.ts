import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/app/store";
import {
  Flags,
  selectActiveDriversByCarIndex,
  selectTrackLengthMeters,
} from "@racedirector/iracing-socket-js";
import { AppListenerEffect } from "src/app/middleware";
import { SessionTimeEvent, sortSessionEvents } from "src/utils";

interface SessionEvent extends SessionTimeEvent {
  sessionNumber: number;
}

export interface SimIncidentEvent extends SessionEvent {
  // The id of the incident
  id: string;
  // The sim value of the incident
  value: number;
  // The present session flags at the session time of the incident detection.
  sessionFlags: Flags;
  // The lap percentage at the session time of incident detection.
  lapPercentage: number;
  // The session time of day.
  sessionTimeOfDay: number;
  // The driver that is detected to have had an incident.
  driverId: number;
  // The car index which is detected to have had an incident.
  carIndex: number;
}

const simIncidentsAdapter = createEntityAdapter<SimIncidentEvent>({
  selectId: ({ id }) => id,
  sortComparer: sortSessionEvents,
});

export const simIncidentsSlice = createSlice({
  name: "simIncidents",
  initialState: simIncidentsAdapter.getInitialState({
    maxSimIncidentWeight: 0,
  }),
  reducers: {
    addIncident: simIncidentsAdapter.addOne,
    addIncidents: simIncidentsAdapter.addMany,
    setIncident: simIncidentsAdapter.setOne,
    setIncidents: simIncidentsAdapter.setMany,
    setAllIncidents: simIncidentsAdapter.setAll,
    setMaxSimIncidentWeight: (state, action: PayloadAction<number>) => {
      state.maxSimIncidentWeight = action.payload;
    },
  },
});

export const {
  setMaxSimIncidentWeight,
  addIncident,
  addIncidents,
  setIncident,
  setAllIncidents,
  setIncidents,
} = simIncidentsSlice.actions;

const simIncidentsSelectors = simIncidentsAdapter.getSelectors<RootState>(
  (state) => state.simIncidents,
);

export const selectSimIncidents = simIncidentsSelectors.selectAll;
export const selectMaxSimIncidentWeight = (state: RootState) =>
  state.simIncidents.maxSimIncidentWeight;
export const selectAllIncidents = simIncidentsSelectors.selectAll;

export const selectAllIncidentsAfterSessionTime = (
  state: RootState,
  sessionTime: number,
) => {
  return selectAllIncidents(state).filter(
    ({ sessionTime: incidentSessionTime }) => {
      return incidentSessionTime >= sessionTime;
    },
  );
};

export const selectSimIncidentsForDriver = (
  state: RootState,
  driverId: number,
) =>
  selectAllIncidents(state).filter(
    ({ driverId: incidentDriverId }) => incidentDriverId === driverId,
  );

export const selectSimIncidentsForCarIndex = (
  state: RootState,
  carIndex: number,
) =>
  selectAllIncidents(state).filter(
    ({ carIndex: incidentCarIndex }) => incidentCarIndex === carIndex,
  );

/**
 * Interface representing an track location
 */
interface TrackLocation {
  lapPercentage: number;
}

export const clusterTrackLocations = <T extends TrackLocation>(
  locations: T[],
  clusterDistanceMeters: number,
  trackLengthMeters: number,
) => {
  const clusterWindow = clusterDistanceMeters / 2;

  return locations.reduce<T[][]>((clusters, location, _index, array) => {
    const incidentLocationMeters = location.lapPercentage * trackLengthMeters;
    const lowerDistanceBound = incidentLocationMeters - clusterWindow;
    const upperDistanceBound = incidentLocationMeters + clusterWindow;

    const cluster = array.filter(({ lapPercentage }) => {
      const location = lapPercentage * trackLengthMeters;
      return location >= lowerDistanceBound && location <= upperDistanceBound;
    });

    if (cluster.length > 0) {
      return [...clusters, cluster];
    }

    return clusters;
  }, []);
};

export const selectClusteredSimIncidentsForTimeWindowSeconds = (
  state: RootState,
  timeWindowSeconds: number,
  clusterDistanceMeters: number,
): SimIncidentEvent[][] => {
  const timeWindowLowerBound =
    state.iRacing.data?.SessionTime - timeWindowSeconds;
  const incidents = selectAllIncidentsAfterSessionTime(
    state,
    timeWindowLowerBound,
  );
  const trackLength = 10; //selectTrackLengthMeters(state.iRacing);

  return clusterTrackLocations(incidents, clusterDistanceMeters, trackLength);
};

export const selectHighestValueIncidentCluster = (
  state: RootState,
  timeWindowSeconds: number,
  clusterDistanceMeters: number,
) => {
  const maxSimIncidentWeight = selectMaxSimIncidentWeight(state);
  const clusters = selectClusteredSimIncidentsForTimeWindowSeconds(
    state,
    timeWindowSeconds,
    clusterDistanceMeters,
  );

  let maxIncidentCount = 0;
  return clusters.reduce<SimIncidentEvent[]>((highestValueCluster, cluster) => {
    const clusterValue = cluster.reduce(
      (value, { value: incidentValue }) =>
        value + Math.min(incidentValue, maxSimIncidentWeight),
      0,
    );

    // If this cluster is worth more, than return it
    if (clusterValue > maxIncidentCount) {
      maxIncidentCount = clusterValue;
      return cluster;
    }

    // Otherwise return the previous cluster
    return highestValueCluster;
  }, []);
};

const incidentFilters = {
  includePaceCar: false,
  includeAI: true,
  includeSpectators: false,
};

// export const checkIncidentsEffect: AppListenerEffect = (
//   _action,
//   listenerApi,
// ) => {
//   const currentState = listenerApi.getState();
//   const previousState = listenerApi.getOriginalState();

//   const currentActiveDrivers = selectActiveDriversByCarIndex(
//     currentState.iRacing,
//     incidentFilters,
//   );
//   const previousActiveDrivers = selectActiveDriversByCarIndex(
//     previousState.iRacing,
//     incidentFilters,
//   );

//   const {
//     data: {
//       CarIdxSessionFlags = [],
//       CarIdxLapDistPct = [],
//       // SessionNum,
//       // SessionTime,
//       // SessionTimeOfDay,
//     } = {},
//   } = currentState.iRacing;

//   Object.entries(currentActiveDrivers).forEach(([carIndex, driver]) => {
//     const existingDriver = previousActiveDrivers?.[carIndex] || null;

//     // !!!: Ensuring that the driver exists and matches the current user ID
//     //      ensures that incidents are processed iff we already know what drivers
//     //      are on track.
//     if (
//       existingDriver &&
//       existingDriver.UserID === driver.UserID &&
//       existingDriver.CurDriverIncidentCount !== driver.CurDriverIncidentCount
//     ) {
//       const incidentCount =
//         driver.CurDriverIncidentCount - existingDriver.CurDriverIncidentCount;

//       if (incidentCount > 0) {
//         // listenerApi.dispatch(
//         //   addIncident({
//         //     id: nanoid(),
//         //     carIndex: parseInt(carIndex),
//         //     value: incidentCount,
//         //     sessionFlags: CarIdxSessionFlags?.[carIndex] || 0x0,
//         //     lapPercentage: CarIdxLapDistPct?.[carIndex] || -1,
//         //     // sessionNumber: SessionNum,
//         //     // sessionTime: SessionTime,
//         //     // sessionTimeOfDay: SessionTimeOfDay,
//         //     driverId: driver.UserID,
//         //   }),
//         // );
//       }
//     }
//   });
// };

export default simIncidentsSlice.reducer;
