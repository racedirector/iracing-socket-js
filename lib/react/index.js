"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingConsumer = exports.iRacingProvider = void 0;
var context_1 = require("./context");
Object.defineProperty(exports, "iRacingProvider", { enumerable: true, get: function () { return context_1.iRacingProvider; } });
Object.defineProperty(exports, "iRacingConsumer", { enumerable: true, get: function () { return context_1.iRacingConsumer; } });
__exportStar(require("./hooks"), exports);
