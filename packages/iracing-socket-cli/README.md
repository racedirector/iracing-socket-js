Output each update to `output.txt` (each update will be a new line)
```bash
$ iracing-socket --host 192.168.4.33:8182 \ 
    --request DriverInfo,CarIdxLapDistPct,SessionTimeOfDay,SessionTime,SessionNum,CarIdxSessionFlags \
    --requestOnce WeekendInfo \
    --fps 1 \
    --output output.txt
```

Output each update to `output.json` (each update will be an entry in an array)
```bash
$ iracing-socket --host 192.168.4.33:8182 \ 
    --request DriverInfo,CarIdxLapDistPct,SessionTimeOfDay,SessionTime,SessionNum,CarIdxSessionFlags \
    --requestOnce WeekendInfo \
    --fps 1 \
    --output output.json
```

Output each update to `stdout`
```bash
$ iracing-socket --host 192.168.4.33:8182 \ 
    --request DriverInfo,CarIdxLapDistPct,SessionTimeOfDay,SessionTime,SessionNum,CarIdxSessionFlags \
    --requestOnce WeekendInfo \
    --fps 1 \
```

Input from `config.json`. Any option can be included/excluded from the `config.json`. Any
excluded, required properties must be passed via CLI options to prevent errors from being
thrown.
```json
{
  "host": "192.168.4.33:8182",
  "fps": 1,
  "request": [
    "DriverInfo",
    "CarIdxLapDistPct",
    "SessionTimeOfDay",
    "SessionTime",
    "SessionNum",
    "CarIdxSessionFlags"
  ],
  "requestOnce": [
    "WeekendInfo"
  ],
  "output": "output.json"
}
```
```bash
$ iracing-socket --config config.json
```
