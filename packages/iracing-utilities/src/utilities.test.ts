import { Flags } from "../../iracing-socket-js/src/types";
import { parseTrackLength, parseNumberFromString, flagsHasFlag } from ".";

describe("iracing util functions", () => {
  describe("parseNumberFromString", () => {
    it("returns the number value from the string", () => {
      const stringValue = "2.34 km";

      expect(parseNumberFromString(stringValue, "km")).toEqual(2.34);
    });

    it("only works on strings matching the format", () => {
      const stringValue = "2.34km";

      expect(parseNumberFromString(stringValue, "km")).toBeNull();
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
