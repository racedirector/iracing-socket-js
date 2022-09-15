import React from "react";

interface DriverRowProps {
  userName: string;
  teamName?: string;
  carNumber: string;
  currentDriverIncidentCount: number;
  teamIncidentCount: number;
}

const DriverRow: React.FC<DriverRowProps> = ({
  userName,
  teamName,
  carNumber,
  currentDriverIncidentCount,
  teamIncidentCount,
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

export const Drivers: React.FC<DriversProps> = ({ drivers }) => (
  <div>
    {drivers.map((props) => (
      <DriverRow {...props} />
    ))}
  </div>
);

export default Drivers;
