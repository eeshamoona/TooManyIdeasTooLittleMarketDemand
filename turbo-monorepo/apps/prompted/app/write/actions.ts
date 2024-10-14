import { TitleOrder } from "@mantine/core";

export const convertTimeToDescription = (elapsedTime: number) => {
  // Convert elapsed time to a descriptive format
  let descriptiveTime: string;
  if (elapsedTime >= 60) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);
    descriptiveTime = `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else {
    descriptiveTime = `${Math.floor(elapsedTime)} second${elapsedTime !== 1 ? "s" : ""}`;
  }
  return descriptiveTime;
};

export function getTitleOrder(promptTextLength: number): TitleOrder {
  if (promptTextLength > 90) {
    return 5;
  } else if (promptTextLength > 60) {
    return 4;
  } else if (promptTextLength > 30) {
    return 3;
  } else {
    return 2;
  }
}
