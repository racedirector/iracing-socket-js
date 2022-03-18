"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimIncidentConsumer = exports.DEFAULT_CONFIG = exports.SimIncidentEvents = void 0;
const core_1 = require("../core");
const lodash_1 = require("lodash");
var SimIncidentEvents;
(function (SimIncidentEvents) {
    SimIncidentEvents["SimIncidents"] = "simIncidents";
})(SimIncidentEvents = exports.SimIncidentEvents || (exports.SimIncidentEvents = {}));
exports.DEFAULT_CONFIG = {
    maxSimIncidentWeight: 2,
};
class SimIncidentConsumer extends core_1.iRacingSocketConsumer {
    constructor({ socket, config = exports.DEFAULT_CONFIG }) {
        super(socket);
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
                const incidents = Object.entries(nextIndex).reduce((incidentIndex, [carIndex, driver]) => {
                    var _a;
                    const existingDriver = ((_a = this.driverIndex) === null || _a === void 0 ? void 0 : _a[carIndex]) || undefined;
                    if (existingDriver && existingDriver.UserID === driver.UserID) {
                        const incidentCount = driver.CurDriverIncidentCount -
                            existingDriver.CurDriverIncidentCount;
                        if (incidentCount > 0) {
                            return Object.assign(Object.assign({}, incidentIndex), { [carIndex]: {
                                    carIndex,
                                    value: incidentCount,
                                    weight: this.weightForIncidentValue(incidentCount),
                                    sessionNumber: nextData.SessionNum || -1,
                                    sessionTime: nextData.SessionTime || -1,
                                    sessionTimeOfDay: nextData.SessionTimeOfDay || -1,
                                    sessionFlags: nextData.SessionFlags || 0x0,
                                    lapPercentage: nextData.CarIdxLapDistPct[carIndex],
                                    driverId: driver.UserID,
                                } });
                        }
                    }
                    return incidentIndex;
                }, {});
                if (!(0, lodash_1.isEmpty)(incidents)) {
                    this.emit(SimIncidentEvents.SimIncidents, incidents);
                }
            }
            this.driverIndex = nextIndex;
        };
        this.weightForIncidentValue = (incidentValue) => {
            return Math.min(incidentValue, this.config.maxSimIncidentWeight);
        };
        this.config = config;
    }
    get config() {
        return this._config;
    }
    set config(config) {
        this._config = Object.assign(Object.assign({}, this._config), config);
    }
}
exports.SimIncidentConsumer = SimIncidentConsumer;
SimIncidentConsumer.requestParameters = [
    "DriverInfo",
    "CarIdxLapDistPct",
    "SessionTimeOfDay",
    "SessionTime",
    "SessionFlags",
    "SessionNum",
];
exports.default = SimIncidentConsumer;
