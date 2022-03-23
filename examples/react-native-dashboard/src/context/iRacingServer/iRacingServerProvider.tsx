import React, {useEffect, useState} from 'react';
import {iRacingServerContext} from './iRacingServerContext';

export interface IRacingServerProviderProps {
  host: string;
}

const IRacingServerProvider: React.FC<IRacingServerProviderProps> = ({
  host: hostProp,
  children,
}) => {
  const [host, setHost] = useState<string | null>(hostProp);

  useEffect(() => {
    setHost(hostProp);
  }, [hostProp]);

  return (
    <iRacingServerContext.Provider
      value={{
        setHost,
        host,
      }}>
      {children}
    </iRacingServerContext.Provider>
  );
};
export {IRacingServerProvider as iRacingServerProvider};
export default IRacingServerProvider;
