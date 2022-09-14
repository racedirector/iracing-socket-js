import React from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import "./index.css";

const App: React.FC<Record<string, never>> = () => {
  const { data, isIRacingConnected, isSocketConnected } = useIRacingContext();

  return (
    <div className="App">
      <header className="App-header">
        <h1>iRacing Socket UI</h1>
        <p>Socket connected? {isSocketConnected ? "yes" : "no"}</p>
        <p>iRacing connected? {isIRacingConnected ? "yes" : "no"}</p>
      </header>

      <body>
        {data && (
          <div className="Code-block">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </body>
    </div>
  );
};

export default App;
