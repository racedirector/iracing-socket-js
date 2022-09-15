import { Driver } from "@racedirector/iracing-socket-js";
import React from "react";

interface DriverRowProps extends Driver {}

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
  drivers: DriverRowProps[];
}

export const Drivers: React.FC<DriversProps> = ({ drivers = [] }) => (
  <div>
    {drivers.map((props) => (
      <DriverRow {...props} key={props.UserID} />
    ))}
  </div>
);

export default Drivers;
