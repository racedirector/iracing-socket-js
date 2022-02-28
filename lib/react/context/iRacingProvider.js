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
exports.iRacingProvider = void 0;
const react_1 = __importStar(require("react"));
const globals_1 = require("../../utilities/globals");
const core_1 = require("../../core");
const iRacingContext_1 = require("./iRacingContext");
const iRacingProvider = ({ socket, children, }) => {
    const iRacingContext = (0, iRacingContext_1.getIRacingContext)();
    const [isSocketConnected, setSocketConnected] = (0, react_1.useState)(false);
    const [isIRacingConnected, setIRacingConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        socket.socketConnectionEmitter
            .on(core_1.iRacingSocketConnectionEvents.Connect, () => setSocketConnected(true))
            .on(core_1.iRacingSocketConnectionEvents.Disconnect, () => setSocketConnected(false));
        socket.iRacingConnectionEmitter
            .on(core_1.iRacingClientConnectionEvents.Connect, () => setIRacingConnected(true))
            .on(core_1.iRacingClientConnectionEvents.Disconnect, () => setIRacingConnected(false));
        return () => {
            socket.close();
            socket.removeAllListeners();
        };
    }, [socket]);
    return (react_1.default.createElement(iRacingContext.Consumer, null, (context = {}) => {
        if (socket && context.socket !== socket) {
            context = Object.assign(Object.assign({}, context), { socket });
        }
        (0, globals_1.invariant)(context.socket, "iRacingProvider was not passed a iRacingSocket instance. Make " +
            'sure you pass in your socket via the "socket" prop.');
        return (react_1.default.createElement(iRacingContext.Provider, { value: Object.assign(Object.assign({}, context), { isSocketConnected,
                isIRacingConnected }) }, children));
    }));
};
exports.iRacingProvider = iRacingProvider;
exports.default = exports.iRacingProvider;
