import React from "react";
import { iRacingSocket } from "../../core";
export interface iRacingConsumerProps {
    children: (raceDirector: iRacingSocket) => React.ReactChild | null;
}
export declare const iRacingConsumer: React.FC<iRacingConsumerProps>;
//# sourceMappingURL=iRacingConsumer.d.ts.map