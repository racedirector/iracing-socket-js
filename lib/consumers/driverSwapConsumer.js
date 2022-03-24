"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSwapConsumer = exports.DriverSwapEvents = void 0;
const lodash_1 = require("lodash");
const core_1 = require("../core");
var DriverSwapEvents;
(function (DriverSwapEvents) {
    DriverSwapEvents["DriverSwaps"] = "driverSwaps";
})(DriverSwapEvents = exports.DriverSwapEvents || (exports.DriverSwapEvents = {}));
class DriverSwapConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.onUpdate = (keys) => {
            var _a;
            if (!keys.includes("DriverInfo")) {
                return;
            }
            const nextData = Object.assign({}, this.socket.data);
            const nextIndex = (0, lodash_1.chain)(((_a = nextData.DriverInfo) === null || _a === void 0 ? void 0 : _a.Drivers) || [])
                .filter(({ CarIsPaceCar }) => !CarIsPaceCar)
                .keyBy("CarIdx")
                .value();
            if (this.driverIndex) {
                const driverSwaps = Object.entries(nextIndex).reduce((swapIndex, [carIndex, driver]) => {
                    var _a;
                    const existingDriver = ((_a = this.driverIndex) === null || _a === void 0 ? void 0 : _a[carIndex]) || undefined;
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
                if (!(0, lodash_1.isEmpty)(driverSwaps)) {
                    this.emit(DriverSwapEvents.DriverSwaps, driverSwaps);
                }
            }
            this._driverIndex = nextIndex;
        };
    }
    get driverIndex() {
        return this._driverIndex;
    }
}
exports.DriverSwapConsumer = DriverSwapConsumer;
DriverSwapConsumer.requestParameters = ["DriverInfo"];
