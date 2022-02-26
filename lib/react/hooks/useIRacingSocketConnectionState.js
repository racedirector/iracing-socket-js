"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIRacingSocketConnectionState = void 0;
const react_1 = require("react");
const context_1 = require("../context");
const useIRacingSocketConnectionState = () => {
    const { socketConnected, iRacingConnected } = (0, react_1.useContext)((0, context_1.getIRacingContext)());
    return {
        socketConnected,
        iRacingConnected,
    };
};
exports.useIRacingSocketConnectionState = useIRacingSocketConnectionState;
