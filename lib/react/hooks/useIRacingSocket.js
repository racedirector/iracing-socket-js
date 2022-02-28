"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIRacingSocket = void 0;
const globals_1 = require("../../utilities/globals");
const core_1 = require("../../core");
const context_1 = require("../context");
const useIRacingSocket = (socketOptions = null) => {
    let { socket } = (0, context_1.useIRacingContext)();
    if (socketOptions) {
        socket = new core_1.iRacingSocket(socketOptions);
    }
    (0, globals_1.invariant)(!!socket, 'Could not find "socket" in the context or pass in as an option. ' +
        "Wrap the root component in an <iRacingProvider>, " +
        "or pass an iRacingSocket instance in via options.");
    return socket;
};
exports.useIRacingSocket = useIRacingSocket;
