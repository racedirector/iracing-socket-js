import * as React from "react";
import { iRacingSocket } from "../../core";
export interface iRacingContextType {
    isSocketConnected: boolean;
    isIRacingConnected: boolean;
    socket?: iRacingSocket;
}
export declare const iRacingContext: React.Context<iRacingContextType>;
export declare const useIRacingContext: () => iRacingContextType;
//# sourceMappingURL=iRacingContext.d.ts.map