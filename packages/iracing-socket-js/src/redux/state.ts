import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { iRacingData } from "../types";
import { iRacingSocketOptions } from "../core";
import { connect } from "./actions";

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

export interface ConnectIRacingPayload extends iRacingSocketOptions {}

export const iRacingSocketSlice = createSlice({
  name: "iRacingSocket",
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnected = action.payload;

      // If the socket connects mark it as not connecting
      if (action.payload) {
        state.isSocketConnecting = false;
      }
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
  extraReducers: (builder) =>
    builder
      // When the connect action is fired, mark the socket as connecting
      .addCase(connect, (state) => {
        state.isSocketConnecting = true;
      })
      .addDefaultCase((state) => state),
});

export const { setSocketConnected, setIRacingConnected, updateIRacingData } =
  iRacingSocketSlice.actions;

export default iRacingSocketSlice.reducer;
