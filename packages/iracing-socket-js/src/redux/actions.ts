import { createAction } from "@reduxjs/toolkit";

export const connect = createAction("iRacingSocket/connect");
export const disconnect = createAction("iRacingSocket/disconnect");
