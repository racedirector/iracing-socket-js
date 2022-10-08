import { useIRacingContext } from "@racedirector/iracing-socket-js";

export const useWindDirection = () => {
  const { data: { WindDir } = {} } = useIRacingContext();
  return (WindDir * 180) / Math.PI + 180;
};

export const useWindDirectionRelativeToCar = () => {
  const { data: { WindDir, YawNorth } = {} } = useIRacingContext();
  return ((WindDir - YawNorth) * 180) / Math.PI + 180;
};

export default useWindDirection;
