import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { iRacingData } from "../types";

export interface IRacingSocketState {
  data?: iRacingData;
  isSocketConnected: boolean;
  isSocketConnecting: boolean;
  isIRacingConnected: boolean;
}

const initialState: IRacingSocketState = {
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

export const selectIRacingSessionInfo = (state: iRacingData) =>
  state.SessionInfo;
export const selectIRacingSessions = (state: iRacingData) =>
  state.SessionInfo.Sessions || [];

export const selectSessionForSessionNumber = (
  state: iRacingData,
  sessionNumber: number,
) => {
  const sessions = selectIRacingSessions(state);
  if (sessionNumber >= 0) {
    return sessions?.[sessionNumber] || {};
  }

  return {};
};

export const selectCurrentSession = (state: iRacingData) => {
  const sessionNumber = state.SessionNum || -1;
  return selectSessionForSessionNumber(state, sessionNumber);
};

export const selectCurrentDriverIndex = (state: iRacingData) =>
  state.DriverInfo?.DriverCarIdx || -1;

export default iRacingSocketSlice.reducer;
