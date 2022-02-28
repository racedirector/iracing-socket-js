"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDriverIndex = void 0;
const react_1 = require("react");
const lodash_1 = require("lodash");
const useIRacingSocket_1 = require("./useIRacingSocket");
const useDriverIndex = (socketOptions = null) => {
    const { data: { DriverInfo: { Drivers: drivers = [] } = {} } = {} } = (0, useIRacingSocket_1.useIRacingSocket)(socketOptions);
    const [index, setIndex] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const currentIndex = (0, lodash_1.keyBy)(drivers, "CarIdx");
        if (!(0, lodash_1.isEqual)(index, currentIndex)) {
            setIndex(currentIndex);
        }
    }, [drivers]);
    return index;
};
exports.useDriverIndex = useDriverIndex;
exports.default = exports.useDriverIndex;
