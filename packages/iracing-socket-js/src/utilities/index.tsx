import { canUseSymbol } from "./globals";

export { canUseSymbol };

export const formatTime = (
  time: number,
  precision = 3,
  showMinutes = false,
) => {
  const sign = time >= 0;
  let normalizedTime = Math.abs(time);

  if (precision > 0) {
    const precisePow = [10, 100, 1000][precision - 1];
    normalizedTime = Math.round(normalizedTime * precisePow) / precisePow;
  } else {
    normalizedTime = Math.round(normalizedTime);
  }

  const hours = (normalizedTime / 3600) | 0;
  const minutes = ((normalizedTime / 60) | 0) % 60;
  const seconds = normalizedTime % 60;

  let res = "";
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString =
    seconds < 10
      ? `0${seconds.toFixed(precision)}`
      : seconds.toFixed(precision);

  if (hours) {
    res += `${hours}:`;
  }

  if (minutes || showMinutes) {
    res += `${minutesString}:${secondsString}`;
  } else {
    res += seconds.toFixed(precision);
  }

  if (!sign) {
    res = `-${res}`;
  }

  return res;
};

export const formatTimeForSession = (time: number) => {
  const hours = (time / 3600) | 0;
  const minutes = ((time / 60) | 0) % 60;
  let result = "";
  if (hours) {
    result += `${hours}h`;
  }

  if (minutes) {
    if (hours && minutes < 10) {
      result += `0${minutes}m`;
    } else {
      result += `${minutes}m`;
    }
  }

  return result;
};
