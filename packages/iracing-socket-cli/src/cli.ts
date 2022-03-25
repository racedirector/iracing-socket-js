import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv)).alias({ h: "help" }).argv;

console.log("Detected argv", argv);
