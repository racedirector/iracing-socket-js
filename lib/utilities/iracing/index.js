"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnTrack = exports.parseTrackLength = exports.parseNumberFromString = exports.flagsHasAllFlags = exports.flagsHasSomeFlags = exports.flagsHasFlags = exports.flagsHasFlag = void 0;
const types_1 = require("../../types");
const flagsHasFlag = (flags, hasFlags) => (flags & hasFlags) === hasFlags;
exports.flagsHasFlag = flagsHasFlag;
const flagsHasFlags = (flags, ...hasFlags) => hasFlags.map((flag) => (0, exports.flagsHasFlag)(flags, flag));
exports.flagsHasFlags = flagsHasFlags;
const flagsHasSomeFlags = (flags, ...hasFlags) => (0, exports.flagsHasFlags)(flags, ...hasFlags).reduce((someFlags, hasFlag) => someFlags || hasFlag, false);
exports.flagsHasSomeFlags = flagsHasSomeFlags;
const flagsHasAllFlags = (flags, ...hasFlags) => hasFlags.every((flag) => (0, exports.flagsHasFlag)(flags, flag));
exports.flagsHasAllFlags = flagsHasAllFlags;
const parseNumberFromString = (sourceValue, unit) => {
    const matches = new RegExp(`^.*(?=\\s${unit})`).exec(sourceValue) || Array();
    if (matches.length > 0) {
        return parseFloat(matches[0]);
    }
    return null;
};
exports.parseNumberFromString = parseNumberFromString;
const parseTrackLength = ({ WeekendInfo: { TrackLength: trackLengthString = null } = {}, }) => {
    if (typeof trackLengthString === "string") {
        return (0, exports.parseNumberFromString)(trackLengthString, "km") * 1000;
    }
    return null;
};
exports.parseTrackLength = parseTrackLength;
const isOnTrack = (location) => location > types_1.TrackLocation.OffTrack;
exports.isOnTrack = isOnTrack;
