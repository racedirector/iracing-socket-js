import * as React from "react";
import { iRacingSocket } from "../../core";
import { iRacingData } from "../../types";
export interface iRacingContextType {
    isSocketConnected: boolean;
    isIRacingConnected: boolean;
    socket?: iRacingSocket;
    data?: iRacingData;
}
export declare const getIRacingContext: () => React.Context<iRacingContextType>;
export { getIRacingContext as resetIRacingContext };
//# sourceMappingURL=iRacingContext.d.ts.map