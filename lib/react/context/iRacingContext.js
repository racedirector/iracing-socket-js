"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetIRacingContext = exports.getIRacingContext = void 0;
const React = __importStar(require("react"));
const utilities_1 = require("../../utilities");
const DEFAULT_CONTEXT = {
    isSocketConnected: false,
    isIRacingConnected: false,
};
const contextKey = utilities_1.canUseSymbol ? Symbol.for("__IRACING__") : "__IRACING__";
const getIRacingContext = () => {
    let context = React.createContext[contextKey];
    if (!context) {
        Object.defineProperty(React.createContext, contextKey, {
            value: (context =
                React.createContext(DEFAULT_CONTEXT)),
            enumerable: false,
            writable: false,
            configurable: true,
        });
        context.displayName = "iRacingContext";
    }
    return context;
};
exports.getIRacingContext = getIRacingContext;
exports.resetIRacingContext = exports.getIRacingContext;
