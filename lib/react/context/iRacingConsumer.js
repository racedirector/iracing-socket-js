"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingConsumer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const globals_1 = require("../../utilities/globals");
const iRacingContext_1 = require("./iRacingContext");
const iRacingConsumer = (props) => {
    return ((0, jsx_runtime_1.jsx)(iRacingContext_1.iRacingContext.Consumer, { children: (context) => {
            (0, globals_1.invariant)(context && context.socket, 'Could not find "socket" in the context of iRacingConsumer. ' +
                "Wrap the root component in a <iRacingProvider>");
            return props.children(context.raceDirector);
        } }, void 0));
};
exports.iRacingConsumer = iRacingConsumer;
