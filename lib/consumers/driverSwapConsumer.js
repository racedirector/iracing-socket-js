"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSwapConsumer = exports.DriverSwapEvents = exports.getDriverSwapIndex = void 0;
const lodash_1 = require("lodash");
const core_1 = require("../core");
const getDriverSwapIndex = (previousIndex, nextIndex) => {
    return Object.entries(nextIndex).reduce((swapIndex, [carIndex, driver]) => {
        const existingDriver = (previousIndex === null || previousIndex === void 0 ? void 0 : previousIndex[carIndex]) || undefined;
        const isDriverSwap = existingDriver
            ? driver.UserID !== existingDriver.UserID
            : true;
        if (isDriverSwap) {
            return Object.assign(Object.assign({}, swapIndex), { [carIndex]: {
                    from: existingDriver,
                    to: driver,
                } });
        }
        return swapIndex;
    }, {});
};
exports.getDriverSwapIndex = getDriverSwapIndex;
var DriverSwapEvents;
(function (DriverSwapEvents) {
    DriverSwapEvents["DriverSwaps"] = "driverSwaps";
})(DriverSwapEvents = exports.DriverSwapEvents || (exports.DriverSwapEvents = {}));
class DriverSwapConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.onUpdate = (keys) => {
            var _a;
            if (keys.includes("DriverInfo")) {
                const nextData = Object.assign({}, this.socket.data);
                const nextIndex = (0, lodash_1.keyBy)(((_a = nextData.DriverInfo) === null || _a === void 0 ? void 0 : _a.Drivers) || [], "CarIdx");
                if (this.driverIndex) {
                    const driverSwaps = (0, exports.getDriverSwapIndex)(this.driverIndex, nextIndex);
                    if (!(0, lodash_1.isEmpty)(driverSwaps)) {
                        this.emit(DriverSwapEvents.DriverSwaps, driverSwaps);
                    }
                }
                this.driverIndex = nextIndex;
            }
        };
    }
}
exports.DriverSwapConsumer = DriverSwapConsumer;
DriverSwapConsumer.requestParameters = ["DriverInfo"];
