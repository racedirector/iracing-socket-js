"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackLocation = void 0;
var TrackLocation;
(function (TrackLocation) {
    TrackLocation[TrackLocation["NotInWorld"] = -1] = "NotInWorld";
    TrackLocation[TrackLocation["OffTrack"] = 0] = "OffTrack";
    TrackLocation[TrackLocation["InPitStall"] = 1] = "InPitStall";
    TrackLocation[TrackLocation["ApproachingPits"] = 2] = "ApproachingPits";
    TrackLocation[TrackLocation["OnTrack"] = 3] = "OnTrack";
})(TrackLocation = exports.TrackLocation || (exports.TrackLocation = {}));
