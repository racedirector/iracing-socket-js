import React from "react";
import { IncidentsTable as IncidentsTableUI } from "../../components/IncidentsTable";

export interface IncidentsTableProps {}

export const IncidentsTable: React.FC<IncidentsTableProps> = () => {
  return <IncidentsTableUI />;
};

export default IncidentsTable;
