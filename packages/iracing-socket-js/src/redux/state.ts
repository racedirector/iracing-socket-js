import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Driver, iRacingData, Session } from "../types";
import _ from "lodash";

export interface IRacingSocketState {
  data?: iRacingData;
  isSocketConnected: boolean;
  isSocketConnecting: boolean;
  isIRacingConnected: boolean;
}

const initialState: IRacingSocketState = {
  data: {},
  isSocketConnected: false,
  isSocketConnecting: false,
  isIRacingConnected: false,
};

export const iRacingSocketSlice = createSlice({
  name: "iRacingSocket",
  initialState,
  reducers: {
    // !!!: Middleware action to connect
    connect: () => {},
    // !!!: Middleware action to disconnect
    disconnect: () => {},
    setSocketConnecting: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnecting = action.payload;
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnected = action.payload;
    },
    setIRacingConnected: (state, action: PayloadAction<boolean>) => {
      state.isIRacingConnected = action.payload;
    },
    updateIRacingData: (state, action: PayloadAction<iRacingData>) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
  },
});

export const {
  connect,
  disconnect,
  setSocketConnected,
  setSocketConnecting,
  setIRacingConnected,
  updateIRacingData,
} = iRacingSocketSlice.actions;

export const selectIRacingSocketConnecting = (state: IRacingSocketState) =>
  state.isSocketConnecting;
export const selectIRacingSocketConnected = (state: IRacingSocketState) =>
  state.isSocketConnected;
export const selectIRacingServiceConnected = (state: IRacingSocketState) =>
  state.isIRacingConnected;

export const selectIRacingConnectionState = (state: IRacingSocketState) => ({
  isIRacingConnected: selectIRacingServiceConnected(state),
  isSocketConnected: selectIRacingSocketConnected(state),
  isConnecting: selectIRacingSocketConnecting(state),
});

export const selectIRacingData = (state: IRacingSocketState) => state.data;

export const selectIRacingSessionInfo = (state: IRacingSocketState) =>
  state.data.SessionInfo;
export const selectIRacingSessions = (state: IRacingSocketState) =>
  state.data.SessionInfo.Sessions || [];

export const selectSessionForSessionNumber = (
  state: IRacingSocketState,
  sessionNumber: number,
): Session | null => {
  const sessions = selectIRacingSessions(state);
  if (sessionNumber >= 0) {
    return sessions?.[sessionNumber] || null;
  }

  return null;
};

export const selectCurrentSession = (state: IRacingSocketState) => {
  const sessionNumber = state.data.SessionNum || -1;
  return selectSessionForSessionNumber(state, sessionNumber);
};

interface FilterDriversResults {
  includeAI: boolean;
  includePaceCar: boolean;
  includeSpectators: boolean;
}

export const filterDrivers = (
  drivers: Driver[],
  { includeAI, includePaceCar, includeSpectators }: FilterDriversResults,
) =>
  drivers.filter(({ CarIsAI, CarIsPaceCar, IsSpectator }) => {
    if (!includeAI && CarIsAI) {
      return false;
    } else if (!includePaceCar && CarIsPaceCar) {
      return false;
    } else if (!includeSpectators && IsSpectator) {
      return false;
    }

    return true;
  });

export const selectCurrentDriverIndex = (state: IRacingSocketState) =>
  state.data.DriverInfo?.DriverCarIdx || -1;

export const selectCurrentDriver = (state: IRacingSocketState) => {
  const currentDriverIndex = selectCurrentDriverIndex(state);
  const activeDrivers = selectActiveDriversByCarIndex(state);
  return activeDrivers?.[currentDriverIndex];
};

export const selectActiveDrivers = (
  state: IRacingSocketState,
  filters: FilterDriversResults = {
    includeAI: true,
    includePaceCar: true,
    includeSpectators: true,
  },
) => filterDrivers(state.data?.DriverInfo?.Drivers || [], filters);

export const selectActiveDriversByCarIndex = (
  state: IRacingSocketState,
  filters: FilterDriversResults = {
    includeAI: true,
    includePaceCar: true,
    includeSpectators: true,
  },
) => _.keyBy(selectActiveDrivers(state, filters), "CarIdx");

export const selectActiveDriversByCarClass = (
  state: IRacingSocketState,
  filters: FilterDriversResults = {
    includeAI: true,
    includePaceCar: true,
    includeSpectators: true,
  },
) => _.groupBy(selectActiveDrivers(state, filters), "CarClassID");

export const selectActiveDriversForClass = (
  state: IRacingSocketState,
  classId: string,
) => selectActiveDriversByCarClass(state)?.[classId];

const MAGIC_NUMBER = 1600;
const getStrengthOfDrivers = (drivers: Driver[]) => {
  const total = drivers.reduce(
    (totalIRating, { IRating }) =>
      totalIRating + Math.pow(2, -IRating / MAGIC_NUMBER),
    0,
  );

  const strength =
    (MAGIC_NUMBER / Math.log(2)) * Math.log(drivers.length / total);

  return strength / 1000;
};

export const selectStrengthOfField = (state: IRacingSocketState) => {
  const drivers = selectActiveDrivers(state, {
    includeAI: false,
    includePaceCar: false,
    includeSpectators: false,
  });

  return getStrengthOfDrivers(drivers);
};

export const selectStrengthOfFieldByClass = (state: IRacingSocketState) => {
  const driversByClass = selectActiveDriversByCarClass(state, {
    includeAI: false,
    includePaceCar: false,
    includeSpectators: false,
  });

  return Object.entries(driversByClass).reduce<Record<string, number>>(
    (index, [classId, drivers]) => {
      const classStrengthOfField = getStrengthOfDrivers(drivers);
      return {
        ...index,
        [classId]: classStrengthOfField,
      };
    },
    {},
  );
};

export default iRacingSocketSlice.reducer;
