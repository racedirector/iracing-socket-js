import React from "react";
import { iRacingSocket } from "../../core";
export interface iRacingProviderProps {
    socket: iRacingSocket;
}
export declare const iRacingProvider: React.FC<iRacingProviderProps>;