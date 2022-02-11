"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRaceSession = exports.isOnTrack = exports.isMultiClass = exports.identifyCarClasses = exports.parseSessionLength = exports.parseTrackLength = exports.PACE_CAR_CLASS_ID = void 0;
const types_1 = require("./types");
exports.PACE_CAR_CLASS_ID = 11;
const getCurrentSession = ({ SessionNum: currentSessionNumber = -1, SessionInfo: { Sessions: sessions = [] } = {}, }) => {
    if (sessions.length > 0) {
        return sessions[currentSessionNumber];
    }
    return null;
};
const parseTrackLength = ({ WeekendInfo: { TrackLength: trackLengthString = null } = {}, }) => {
    if (typeof trackLengthString === "string") {
        const matches = /^.*(?=\skm)/.exec(trackLengthString);
        if (matches.length > 0) {
            return parseFloat(matches[0]) * 1000;
        }
    }
    return null;
};
exports.parseTrackLength = parseTrackLength;
const parseSessionLength = (data) => {
    const { SessionTime: currentSessionLengthString = null } = getCurrentSession(data) || {};
    if (typeof currentSessionLengthString === "string") {
        const matches = /^.*(?=\ssec)/.exec(currentSessionLengthString);
        if (matches.length > 0) {
            return parseFloat(matches[0]);
        }
    }
    return null;
};
exports.parseSessionLength = parseSessionLength;
const identifyCarClasses = (drivers, includePaceCar = false) => drivers.reduce((classIndex, driver) => {
    const carClassId = driver.CarClassID;
    if (!includePaceCar && carClassId === exports.PACE_CAR_CLASS_ID) {
        return classIndex;
    }
    if (!classIndex[carClassId]) {
        return Object.assign(Object.assign({}, classIndex), { [carClassId]: {
                id: carClassId,
                className: driver.CarClassShortName,
                relativeSpeed: driver.CarClassRelSpeed,
            } });
    }
    return classIndex;
}, {});
exports.identifyCarClasses = identifyCarClasses;
const isMultiClass = (drivers) => {
    let singleClassId = null;
    return !drivers.every(({ CarClassID }) => {
        const isPaceCar = CarClassID === exports.PACE_CAR_CLASS_ID;
        if (isPaceCar) {
            return true;
        }
        if (!singleClassId) {
            singleClassId = CarClassID;
            return true;
        }
        return CarClassID === singleClassId;
    });
};
exports.isMultiClass = isMultiClass;
const isOnTrack = (location) => location > types_1.TrackLocation.OffTrack;
exports.isOnTrack = isOnTrack;
const isRaceSession = ({ SessionName }) => {
    return SessionName === "RACE";
};
exports.isRaceSession = isRaceSession;
