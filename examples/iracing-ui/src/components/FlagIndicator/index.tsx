import React from "react";

export interface FlagIndicatorProps {
  value: number;
}

export const FlagIndicator: React.FC<FlagIndicatorProps> = ({ value }) => {
  return (
    <div className="Flags">
      <h1>Flags</h1>
      {value & 0x0001 ? <h4>Checkered is out</h4> : null}
      {value & 0x0002 ? <h4>White is out</h4> : null}
      {value & 0x0004 ? <h4>Green is out</h4> : null}
      {value & 0x0008 ? <h4>Yellow is out</h4> : null}
      {value & 0x8000 ? <h4>Caution is waving</h4> : null}
      {value & 0x4000 ? <h4>Caution is out</h4> : null}
      {value & 0x0100 ? <h4>Yellow is waving</h4> : null}
      {value & 0x0200 ? <h4>One to green</h4> : null}
      {value & 0x0400 ? <h4>Green held</h4> : null}
      {value & 0x0200 ? <h4>Ten to go</h4> : null}
      {value & 0x1000 ? <h4>One to green</h4> : null}
      {value & 0x10000000 ? <h4>Start hidden</h4> : null}
      {value & 0x20000000 ? <h4>Start ready</h4> : null}
      {value & 0x40000000 ? <h4>Start set</h4> : null}
      {value & 0x80000000 ? <h4>Start go</h4> : null}
    </div>
  );
};

export default FlagIndicator;
