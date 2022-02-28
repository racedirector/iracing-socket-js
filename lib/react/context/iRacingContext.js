"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetIRacingContext = exports.getIRacingContext = void 0;
const react_1 = __importDefault(require("react"));
const utilities_1 = require("../../utilities");
const DEFAULT_CONTEXT = {
    isSocketConnected: false,
    isIRacingConnected: false,
};
const contextKey = utilities_1.canUseSymbol ? Symbol.for("__IRACING__") : "__IRACING__";
const getIRacingContext = () => {
    let context = react_1.default.createContext[contextKey];
    if (!context) {
        Object.defineProperty(react_1.default.createContext, contextKey, {
            value: (context =
                react_1.default.createContext(DEFAULT_CONTEXT)),
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
