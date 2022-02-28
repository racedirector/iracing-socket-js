"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSwapObserver = exports.DriverSwapObserverEvents = exports.getDriverSwapIndex = exports.IRACING_REQUEST_PARAMS = void 0;
const iracing_socket_js_1 = require("iracing-socket-js");
const lodash_1 = require("lodash");
exports.IRACING_REQUEST_PARAMS = ['DriverInfo'];
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
var DriverSwapObserverEvents;
(function (DriverSwapObserverEvents) {
    DriverSwapObserverEvents["DriverSwaps"] = "driverSwaps";
})(DriverSwapObserverEvents = exports.DriverSwapObserverEvents || (exports.DriverSwapObserverEvents = {}));
class DriverSwapObserver extends iracing_socket_js_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.onUpdate = (keys) => {
            var _a;
            if (keys.includes('DriverInfo')) {
                const nextData = Object.assign({}, this.socket.data);
                const nextIndex = (0, lodash_1.keyBy)(((_a = nextData.DriverInfo) === null || _a === void 0 ? void 0 : _a.Drivers) || [], 'carIdx');
                if (this.driverIndex) {
                    const driverSwaps = (0, exports.getDriverSwapIndex)(this.driverIndex, nextIndex);
                    if (!(0, lodash_1.isEmpty)(driverSwaps)) {
                        this.emit(DriverSwapObserverEvents.DriverSwaps, driverSwaps);
                    }
                }
                this.driverIndex = nextIndex;
            }
        };
    }
}
exports.DriverSwapObserver = DriverSwapObserver;
