import { useIRacingContext } from "@racedirector/iracing-socket-js";

const radiansToDegrees = (radians) => (radians * 180) / Math.PI + 180;

export const useWindDirection = () => {
  const { data: { WindDir } = {} } = useIRacingContext();
  return radiansToDegrees(WindDir);
};

export const useWindDirectionRelativeToCar = () => {
  const { data: { WindDir, YawNorth } = {} } = useIRacingContext();
  return radiansToDegrees(WindDir - YawNorth);
};

export default useWindDirection;
