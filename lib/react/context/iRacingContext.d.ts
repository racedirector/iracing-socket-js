import React from "react";
import { iRacingSocket } from "../../core";
import { iRacingData } from "../../types";
export interface iRacingContextType {
    socketConnected: boolean;
    iRacingConnected: boolean;
    socket?: iRacingSocket;
    data?: iRacingData;
}
export declare const getIRacingContext: () => React.Context<iRacingContextType>;
export { getIRacingContext as resetIRacingContext };
