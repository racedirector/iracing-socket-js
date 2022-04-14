#!/bin/sh

HOST_ADDRESS="localhost:8182"
HOST_FLAG="--host $HOST_ADDRESS"

LOG_SUFFIX=$(date +%s)

START_DRIVER_SWAP_COMMAND="yarn iracing-driver-swaps $HOST_FLAG --output driver_swap_$LOG_SUFFIX.txt"
START_FLAGS_COMMAND="yarn iracing-flags $HOST_FLAG --output flags_$LOG_SUFFIX.txt"
START_LAPS_COMMAND="yarn iracing-laps $HOST_FLAG --output laps_$LOG_SUFFIX.txt"
START_PIT_TIMING_COMMAND="yarn iracing-pit-timing $HOST_FLAG --output pit_timing_$LOG_SUFFIX.txt"
START_SIM_INCIDENT_COMMAND="yarn iracing-sim-incidents $HOST_FLAG --output sim_incidents_$LOG_SUFFIX.txt"

yarn dlx concurrently "$START_DRIVER_SWAP_COMMAND" \
  "$START_FLAGS_COMMAND" \
  "$START_LAPS_COMMAND" \
  "$START_PIT_TIMING_COMMAND" \
  "$START_SIM_INCIDENT_COMMAND"