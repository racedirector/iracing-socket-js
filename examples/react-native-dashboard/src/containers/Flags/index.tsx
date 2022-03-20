import React from 'react';

export interface FlagsProps {}

export const Flags: React.FC<FlagsProps> = ({children}) => {
  return <>{children}</>;
};

export default Flags;
