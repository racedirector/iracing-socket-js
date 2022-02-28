"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const globals_1 = require("../../utilities/globals");
const core_1 = require("../../core");
const iRacingContext_1 = require("./iRacingContext");
const iRacingProvider = ({ socket, children, }) => {
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
    return ((0, jsx_runtime_1.jsx)(iRacingContext_1.iRacingContext.Consumer, { children: (context = {}) => {
            if (socket && context.socket !== socket) {
                context = Object.assign(Object.assign({}, context), { socket });
            }
            (0, globals_1.invariant)(context.socket, "iRacingProvider was not passed a iRacingSocket instance. Make " +
                'sure you pass in your socket via the "socket" prop.');
            return ((0, jsx_runtime_1.jsx)(iRacingContext_1.iRacingContext.Provider, Object.assign({ value: Object.assign(Object.assign({}, context), { isSocketConnected,
                    isIRacingConnected }) }, { children: children }), void 0));
        } }, void 0));
};
exports.iRacingProvider = iRacingProvider;
exports.default = exports.iRacingProvider;
