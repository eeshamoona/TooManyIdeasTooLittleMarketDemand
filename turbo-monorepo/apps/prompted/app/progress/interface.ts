import { FaQuestionCircle } from "react-icons/fa";
import { FaSpaceAwesome } from "react-icons/fa6";

export interface BadgeModel {
  id: string;
  icon: string;
  title: string;
  description: string;
  criteria: string;
  thresholds: any[] | null;
  hasLevels: boolean;
}

export interface ProgressModel {
  id: number;
  user_id: string;
  badge_id: number;
  progress: number | null;
  achieved: boolean | null;
  hasLevels: boolean;
  badges: BadgeModel;
}

export const icon_map = {
  FaQuestionCircle: FaQuestionCircle,
  FaSpaceAwesome: FaSpaceAwesome,
};

export const getProgressInfo = (progress: number, thresholds: number[]) => {
  let lowThreshold = 0;
  let highThreshold = Infinity;
  let level = 1;

  for (let i = 0; i < thresholds.length; i++) {
    // if progress is between the current threshold and the next one
    if (progress >= thresholds[i]) {
      lowThreshold = thresholds[i];
      level = level + 1;
    }
    // when progress does not exceed the next threshold
    if (progress < thresholds[i]) {
      highThreshold = thresholds[i];
      break;
    }
  }

  const progressValue =
    ((progress - lowThreshold) / (highThreshold - lowThreshold)) * 100;

  return { lowThreshold, highThreshold, progressValue, level };
};
