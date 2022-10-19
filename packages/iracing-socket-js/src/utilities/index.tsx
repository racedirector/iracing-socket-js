import { canUseSymbol } from "./globals";
export * from "./position";

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

  let response = "";
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString =
    seconds < 10
      ? `0${seconds.toFixed(precision)}`
      : seconds.toFixed(precision);

  if (hours) {
    response += `${hours}:`;
  }

  if (minutes || showMinutes) {
    response += `${minutesString}:${secondsString}`;
  } else {
    response += seconds.toFixed(precision);
  }

  if (!sign) {
    response = `-${response}`;
  }

  return response;
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
