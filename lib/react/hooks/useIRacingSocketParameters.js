"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIRacingSocketParameters = void 0;
const react_1 = require("react");
const globals_1 = require("../../utilities/globals");
const context_1 = require("../context");
const useIRacingSocketParameters = () => {
    const { socket } = (0, react_1.useContext)((0, context_1.getIRacingContext)());
    (0, globals_1.invariant)(!!socket, 'Could not find "socket" in the context or pass in as an option. ' +
        "Wrap the root component in an <iRacingProvider>, or pass an iRacingSocket instance in via options.");
    return {
        server: socket.server,
        requestParameters: socket.requestParameters,
        requestParametersOnce: socket.requestParametersOnce,
        fps: socket.fps,
        readIBT: socket.readIBT,
        reconnectTimeoutInterval: socket.reconnectTimeoutInterval,
    };
};
exports.useIRacingSocketParameters = useIRacingSocketParameters;
exports.default = exports.useIRacingSocketParameters;
