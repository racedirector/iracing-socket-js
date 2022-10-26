import { useEffect, EffectCallback } from "react";
import { TrackLocation } from "../../types";
import { useIRacingContext } from "../context";
import usePrevious from "./usePrevious";

type TrackLocationEffectCallback = (
  newTrackSurface: TrackLocation,
  previousTrackSurface: TrackLocation,
) => void;

export const useTrackLocationTransitionEffect = (
  effect: TrackLocationEffectCallback,
) => {
  const { data: { PlayerTrackSurface: playerTrackSurface } = {} } =
    useIRacingContext();

  const previousPlayerTrackSurface = usePrevious(playerTrackSurface);

  useEffect(() => {
    if (
      typeof playerTrackSurface === "undefined" ||
      typeof previousPlayerTrackSurface === "undefined" ||
      playerTrackSurface === previousPlayerTrackSurface
    ) {
      return;
    }

    effect(playerTrackSurface, previousPlayerTrackSurface);
  }, [effect, playerTrackSurface, previousPlayerTrackSurface]);
};

export const useTrackLocationTransitionedFromLocation = (
  fromLocation: TrackLocation,
  effect: TrackLocationEffectCallback,
) => {
  useTrackLocationTransitionEffect((nextLocation, previousLocation) => {
    if (previousLocation === fromLocation) {
      return effect(nextLocation, previousLocation);
    }
  });
};

export const usePlayerTowEffect = (effect: EffectCallback) => {
  useTrackLocationTransitionEffect((newLocation, previousLocation) => {
    if (
      previousLocation === TrackLocation.OnTrack &&
      newLocation === TrackLocation.InPitStall
    ) {
      effect();
    }
  });
};

export const useLapResetEffect = (effect: EffectCallback) => {
  useTrackLocationTransitionEffect((newLocation, previousLocation) => {
    const onTrackToPitStall =
      previousLocation === TrackLocation.OnTrack &&
      newLocation === TrackLocation.InPitStall;

    const pitStallToTrack =
      previousLocation === TrackLocation.InPitStall &&
      newLocation === TrackLocation.OnTrack;

    if (
      newLocation === TrackLocation.NotInWorld ||
      onTrackToPitStall ||
      pitStallToTrack
    ) {
      effect();
    }
  });
};
