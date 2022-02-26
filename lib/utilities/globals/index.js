"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseSymbol = exports.invariant = exports.InvariantError = void 0;
var ts_invariant_1 = require("ts-invariant");
Object.defineProperty(exports, "InvariantError", { enumerable: true, get: function () { return ts_invariant_1.InvariantError; } });
Object.defineProperty(exports, "invariant", { enumerable: true, get: function () { return ts_invariant_1.invariant; } });
exports.canUseSymbol = typeof Symbol === "function" && typeof Symbol.for === "function";
