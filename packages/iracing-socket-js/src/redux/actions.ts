import { createAction } from "@reduxjs/toolkit";
import { iRacingSocketOptions } from "../core";

export const connect = createAction<iRacingSocketOptions>(
  "iRacingSocket/connect",
);

export const disconnect = createAction("iRacingSocket/disconnect");
