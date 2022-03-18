import { Flags, TrackLocation } from "../../types";
import {
  parseTrackLength,
  isOnTrack,
  isRaceSession,
  isMultiClass,
  parseNumberFromString,
  flagsHasFlag,
} from ".";

describe("iracing util functions", () => {
  describe("parseNumberFromString", () => {
    it("returns the number value from the string", () => {
      const stringValue = "2.34 km";

      expect(parseNumberFromString(stringValue, "km")).toEqual(2.34);
    });
  });

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

  describe("flagsHasFlag", () => {
    it("Can tell if a single flag is in the bitfield", () => {
      expect(
        flagsHasFlag(Flags.CautionWaving, Flags.CautionWaving),
      ).toBeTruthy();

      expect(flagsHasFlag(Flags.CautionWaving, Flags.Caution)).toBeFalsy();
    });

    it("Can tell if multiple flags are in the bitfield", () => {
      // The race is about to go green, but the user has a meatball!
      const runningFlags =
        Flags.StartHidden |
        Flags.OneLapToGreen |
        Flags.Repair |
        Flags.GreenHeld;

      const aboutToGoGreen = Flags.StartHidden | Flags.GreenHeld;
      expect(flagsHasFlag(runningFlags, aboutToGoGreen)).toBeTruthy();
    });
  });
});
