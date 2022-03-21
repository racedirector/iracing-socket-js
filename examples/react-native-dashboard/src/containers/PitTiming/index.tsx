import React from 'react';
import {PitTiming as PitTimingUI} from '../../components/PitTiming';

export interface PitTimingProps {}

export const PitTiming: React.FC<PitTimingProps> = ({children}) => {
  return <PitTimingUI>{children}</PitTimingUI>;
};

export default PitTiming;
