"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIRacingSocketConnectionState = void 0;
const context_1 = require("../context");
const useIRacingSocketConnectionState = () => {
    const { isSocketConnected, isIRacingConnected } = (0, context_1.useIRacingContext)();
    return {
        isSocketConnected,
        isIRacingConnected,
    };
};
exports.useIRacingSocketConnectionState = useIRacingSocketConnectionState;
