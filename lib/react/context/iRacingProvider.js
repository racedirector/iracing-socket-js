"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingProvider = void 0;
const react_1 = require("react");
const globals_1 = require("../../utilities/globals");
const core_1 = require("../../core");
const iRacingContext_1 = require("./iRacingContext");
const iRacingProvider = ({ socket, children, }) => {
    const iRacingContext = (0, iRacingContext_1.getIRacingContext)();
    const [socketConnected, setSocketConnected] = (0, react_1.useState)(false);
    const [iRacingConnected, setIRacingConnected] = (0, react_1.useState)(false);
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
        return (react_1.default.createElement(iRacingContext.Provider, { value: Object.assign(Object.assign({}, context), { socketConnected, iRacingConnected }) }, children));
    }));
};
exports.iRacingProvider = iRacingProvider;
