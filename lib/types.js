"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitServiceFlags = exports.TrackLocation = void 0;
var TrackLocation;
(function (TrackLocation) {
    TrackLocation[TrackLocation["NotInWorld"] = -1] = "NotInWorld";
    TrackLocation[TrackLocation["OffTrack"] = 0] = "OffTrack";
    TrackLocation[TrackLocation["InPitStall"] = 1] = "InPitStall";
    TrackLocation[TrackLocation["ApproachingPits"] = 2] = "ApproachingPits";
    TrackLocation[TrackLocation["OnTrack"] = 3] = "OnTrack";
})(TrackLocation = exports.TrackLocation || (exports.TrackLocation = {}));
var PitServiceFlags;
(function (PitServiceFlags) {
    PitServiceFlags[PitServiceFlags["LFChange"] = 1] = "LFChange";
    PitServiceFlags[PitServiceFlags["RFChange"] = 2] = "RFChange";
    PitServiceFlags[PitServiceFlags["LRChange"] = 4] = "LRChange";
    PitServiceFlags[PitServiceFlags["RRChange"] = 8] = "RRChange";
    PitServiceFlags[PitServiceFlags["Fuel"] = 16] = "Fuel";
    PitServiceFlags[PitServiceFlags["WindshieldTearoff"] = 32] = "WindshieldTearoff";
    PitServiceFlags[PitServiceFlags["FastRepair"] = 64] = "FastRepair";
})(PitServiceFlags = exports.PitServiceFlags || (exports.PitServiceFlags = {}));
