import { TrackLocation } from "./types";
import {
  parseTrackLength,
  isOnTrack,
  isRaceSession,
  isMultiClass,
} from "./utils";

describe("Race director util functions", () => {
  describe("parseTrackLength", () => {
    it("returns the approximate length of the track, in meters, or null", () => {
      const expectedLength = 2.34 * 1000;
      const validTrackLengthData = {
        WeekendInfo: {
          TrackLength: "2.34 km",
        },
      };

      expect(parseTrackLength(validTrackLengthData)).toEqual(expectedLength);
      expect(parseTrackLength({})).toBeNull();
    });
  });

  describe("isOnTrack", () => {
    it("properly indicates if the location is on/off track", () => {
      const onTrackValues = [
        isOnTrack(TrackLocation.OnTrack),
        isOnTrack(TrackLocation.InPitStall),
        isOnTrack(TrackLocation.ApproachingPits),
        isOnTrack(TrackLocation.OnTrack),
      ];

      const offTrackValues = [
        isOnTrack(TrackLocation.OffTrack),
        isOnTrack(TrackLocation.NotInWorld),
      ];

      // Expect the on track values to be true
      expect(
        onTrackValues.reduce((testValue, value) => testValue && value, true),
      ).toBeTruthy();

      // Expect the off track values to be false
      expect(
        offTrackValues.reduce((testValue, value) => testValue || value, false),
      ).toBeFalsy();
    });
  });

  describe("isRaceSession", () => {
    it("properly recognizes a race session", () => {
      expect(isRaceSession({ SessionName: "RACE" })).toBeTruthy();
      expect(isRaceSession({ SessionName: "PRACTICE" })).toBeFalsy();
    });
  });

  describe("isMultiClass", () => {
    it("properly identifies a multiclass race session, excluding the pace car", () => {
      expect(
        isMultiClass([
          {
            CarClassID: 11,
          },
          {
            CarClassID: 14,
          },
          {
            CarClassID: 15,
          },
        ]),
      ).toBeTruthy();

      expect(
        isMultiClass([
          {
            CarClassID: 11,
          },
          {
            CarClassID: 14,
          },
          {
            CarClassID: 14,
          },
        ]),
      ).toBeFalsy();
    });
  });
});
