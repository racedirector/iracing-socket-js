import { Driver } from "@racedirector/iracing-socket-js";
import React from "react";

interface DriverRowProps extends Driver {
  onPress: () => void;
}

const DriverRow: React.FC<DriverRowProps> = ({
  UserName: userName,
  TeamName: teamName,
  CarNumber: carNumber,
  CurDriverIncidentCount: currentDriverIncidentCount,
  TeamIncidentCount: teamIncidentCount,
}) => (
  <div>
    <p>{`#${carNumber}`}</p>
    <p>{userName}</p>
    {teamName && <p>({teamName})</p>}
    <p>
      {teamIncidentCount} ({currentDriverIncidentCount})
    </p>
  </div>
);

export interface DriversProps {
  drivers: Omit<DriverRowProps, "onPress">[];
  onPressDriver: (carIndex: number) => void;
}

export const Drivers: React.FC<DriversProps> = ({
  drivers = [],
  onPressDriver,
}) => (
  <div>
    {drivers.map((props) => (
      <DriverRow
        {...props}
        key={props.UserID}
        onPress={() => {
          onPressDriver(props.CarIdx);
        }}
      />
    ))}
  </div>
);

export default Drivers;
