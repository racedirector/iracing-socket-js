import {
  CarClassIndex,
  CarClassIdentifier,
  TrackLocation,
  CarClassIDProvider,
  iRacingData,
  PACE_CAR_CLASS_ID,
} from "./types";

const getCurrentSession = ({
  SessionNum: currentSessionNumber = -1,
  SessionInfo: { Sessions: sessions = [] } = {},
}: iRacingData): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (sessions.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return sessions[currentSessionNumber];
  }

  return null;
};

export const parseTrackLength = ({
  WeekendInfo: { TrackLength: trackLengthString = null } = {},
}: iRacingData): number | null => {
  if (typeof trackLengthString === "string") {
    const matches = /^.*(?=\skm)/.exec(trackLengthString);
    if (matches.length > 0) {
      return parseFloat(matches[0]) * 1000;
    }
  }

  return null;
};

export const parseSessionLength = (data: iRacingData): number | null => {
  const { SessionTime: currentSessionLengthString = null } =
    getCurrentSession(data) || {};

  if (typeof currentSessionLengthString === "string") {
    const matches = /^.*(?=\ssec)/.exec(currentSessionLengthString);
    if (matches.length > 0) {
      return parseFloat(matches[0]);
    }
  }

  return null;
};

export const identifyCarClasses = (
  drivers: CarClassIdentifier[],
  includePaceCar: boolean = false,
): CarClassIndex =>
  drivers.reduce((classIndex, driver): CarClassIndex => {
    const carClassId = driver.CarClassID;
    if (!includePaceCar && carClassId === PACE_CAR_CLASS_ID) {
      return classIndex;
    }

    if (!classIndex[carClassId]) {
      return {
        ...classIndex,
        [carClassId]: {
          id: carClassId,
          className: driver.CarClassShortName,
          relativeSpeed: driver.CarClassRelSpeed,
        },
      };
    }

    return classIndex;
  }, {} as CarClassIndex);

export const isMultiClass = (drivers: CarClassIDProvider[]): boolean => {
  let singleClassId = null;
  return !drivers.every(({ CarClassID }) => {
    const isPaceCar = CarClassID === PACE_CAR_CLASS_ID;
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

/**
 *
 * @param location a track location
 * @returns whether or not the track location is on track.
 */
export const isOnTrack = (location: TrackLocation) =>
  location > TrackLocation.OffTrack;

interface SessionNameProvider {
  SessionName: "RACE" | string;
}

export const isRaceSession = ({ SessionName }: SessionNameProvider) => {
  return SessionName === "RACE";
};
