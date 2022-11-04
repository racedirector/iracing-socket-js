import React, { PropsWithChildren } from "react";

export interface IncidentsTableProps {}

export const IncidentsTable: React.FC<
  PropsWithChildren<IncidentsTableProps>
> = ({ children }) => {
  return <>{children}</>;
};

export default IncidentsTable;
