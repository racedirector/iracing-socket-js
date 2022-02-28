"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIRacingSocketData = void 0;
const react_1 = require("react");
const __1 = require("../..");
const context_1 = require("../context");
const useIRacingSocketData = () => {
    let { socket } = (0, context_1.useIRacingContext)();
    const [data, setData] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        function handleUpdate() {
            setData(Object.assign({}, socket.data));
        }
        socket.on(__1.iRacingSocketEvents.Update, handleUpdate);
        return () => {
            socket.removeListener(__1.iRacingSocketEvents.Update, handleUpdate);
        };
    }, [socket]);
    return data;
};
exports.useIRacingSocketData = useIRacingSocketData;
