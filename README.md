### Usage
#### iRacingBrowserApps
1) Install iRacingBrowserApps
2) Start `server.exe`

#### Kapps
1) Start kapps

### Example
`src/flagObserver.ts`
```ts
import { Flags } from "./types";
import { iRacingSocketConsumer } from "./socketConsumer";

export const IRACING_REQUEST_PARAMS: string[] = ["SessionFlags", "SessionTime"];

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
