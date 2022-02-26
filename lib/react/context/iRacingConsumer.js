"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingConsumer = void 0;
const react_1 = require("react");
const globals_1 = require("../../utilities/globals");
const iRacingContext_1 = require("./iRacingContext");
const iRacingConsumer = (props) => {
    const iRacingContext = (0, iRacingContext_1.getIRacingContext)();
    return (react_1.default.createElement(iRacingContext.Consumer, null, (context) => {
        (0, globals_1.invariant)(context && context.socket, 'Could not find "socket" in the context of iRacingConsumer. ' +
            "Wrap the root component in a <iRacingProvider>");
        return props.children(context.raceDirector);
    }));
};
exports.iRacingConsumer = iRacingConsumer;
