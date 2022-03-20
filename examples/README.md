# Examples
The following examples may/may not:
  - include every consumer that is decided to be included in the library.
  - work for all use cases.
  - actually help you and you lap time.
  - _work_ at any given time.

The examples are given as a best practice for how to consume the library, any major interface
changes will be documented and kept up to date in the following exmaples as migration guides.

Help applying the library to your (`js`) use case is much appreciated, and will be rewarded with faster
lap times from the racing gods.

Please enjoy :)

### `react-native-dashboard`

Includes an example of the following consumers, visualized:
  - [ ] Flag consumer
    - [ ] A list of all detected flag changes for the user, as a raw int.
      - These values can be converted to hex, to which bitwise operations can be applied to see specifics.
  - [ ] Lap consumer
    - [ ] Visual components representing the tracked arrays
    - [ ] Visual components representing the race lap count
    - [ ] Visual component representing the laps/time remaining
  - [ ] Pit timing consumer
    - [ ] Visual components representing a full pit stop cycle (for the current driver):
      - [ ] Pit entry time
      - [ ] Pit box entry time
      - [ ] Pit service start time
      - [ ] Pit service end time
      - [ ] Pit box exit time
      - [ ] Pit exit time
      - [ ] Pit lane duration (Time between the cones)
      - [ ] Pit duration (Time from approaching the pits [sans illegal entries] to back on track)
      - [ ] (Maybe) Something to indicate if it was a tow? idk
  - [ ] Driver swap consumer
    - [ ] Visual component representing detected driver swap events (across an entire session)
      - [ ] Grouped by session number
      - [ ] Sorted by session time
  - [ ] Sim incident consumer (typically for the current driver, for all drivers if current driver is admin of session)
    - [ ] Visual component representing detected sim incident events
      - [ ] List driver, lap percentage, estimated location (if possible?), lap, session time, track meta (?)
