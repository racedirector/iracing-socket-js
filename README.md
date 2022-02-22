### Usage
#### iRacingBrowserApps
1) Install iRacingBrowserApps
2) Start `server.exe`

#### Kapps
1) Start kapps

### Example
#### Create a socket
```ts
import {iRacingSocket} from 'iracing-socket-js'

const socket: iRacingSocket = new iRacingSocket({
  server,
  fps,
  requestParameters,
  requestParametersOnce,
})
.on(iRacingSocketEvents.SocketConnect, () => setSocketConnected(true))
.on(iRacingSocketEvents.SocketDisconnect, () => setSocketConnected(false))
.on(iRacingSocketEvents.Connect, () => setIRacingConnected(true))
.on(iRacingSocketEvents.Disconnect, () => setIRacingConnected(false))
.on(iRacingSocketEvents.Update, () => setData({...newSocket.data}));
```
#### Create a socket consumer (taken from `src/flagObserver.ts`)
```ts
import {iRacingSocketConsumer, Flags} from "iracing-socket-js";

export const IRACING_REQUEST_PARAMS: string[] = ["SessionFlags", "SessionTime", "SessionTimeOfDay"];

export enum FlagsObserverEvents {
  FlagChange = "flagChange",
}

export class FlagsObserver extends iRacingSocketConsumer {
  private previousFlags: Flags;

  onUpdate = (keys: string[]) => {
    if (!keys.includes("SessionFlags")) {
      return;
    }

    const {
      SessionFlags: flags = -1,
      SessionTime: sessionTime,
      SessionTimeOfDay: sessionTimeOfDay,
    } = this.socket.data;

    if (flags !== this.previousFlags) {
      this.emit(
        FlagsObserverEvents.FlagChange,
        this.previousFlags,
        flags,
        sessionTime,
        sessionTimeOfDay,
      );

      this.previousFlags = flags as Flags;
    }
  };
}

export default FlagsObserver;

```
#### Connect the socket observer to the socket
```ts
const flagObserver = new FlagObserver(socket)
// !!!: Or, pass the options for creating a new socket directly to the socket consumer:
const flagObserver = new FlagObserver({
  server,
  fps,
  requestParameters,
  requestParametersOnce,
})
```
