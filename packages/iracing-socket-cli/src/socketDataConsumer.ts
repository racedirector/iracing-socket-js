import {
  iRacingSocket,
  iRacingSocketConsumer,
} from "@racedirector/iracing-socket-js";
import { createWriteStream, existsSync, WriteStream } from "fs";

export interface SocketDataConsumerOptions {
  outputPath?: string;
}

export class SocketDataConsumer extends iRacingSocketConsumer {
  private fileHandle: WriteStream | null = null;

  constructor(
    socket: iRacingSocket,
    { outputPath }: SocketDataConsumerOptions = {},
  ) {
    super(socket);

    if (outputPath) {
      if (existsSync(outputPath)) {
        throw new Error(`Output path (${outputPath}) already exists!`);
      }

      this.fileHandle = createWriteStream(outputPath);
    }
  }

  onUpdate = (_keys: string[]) => {
    this.writeData(this.socket.data);
  };

  private writeData = (data) => {
    // If the file handle exists, write the JSON to the file, otherwise send it to the console
    if (this.fileHandle) {
      this.fileHandle.write(JSON.stringify(data));
    } else {
      console.log(data);
    }
  };
}

export default SocketDataConsumer;
