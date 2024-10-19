import { FaQuestionCircle } from "react-icons/fa";
import { FaSpaceAwesome } from "react-icons/fa6";

export interface BadgeModel {
  id: string;
  icon: string;
  title: string;
  description: string;
  criteria: string;
  label: string;
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

export const getBadgeColor = (level: number) => {
  switch (level) {
    case 1:
      return "#F0F4FF"; // Lightest Blue (starting level)
    case 2:
      return "#BBD2F6"; // Light Blue (progression)
    case 3:
      return "#7FA3E9"; // Medium Blue (mid-level)
    case 4:
      return "#4A76D8"; // Darker Blue (higher)
    case 5:
      return "#2943A8"; // Deep Blue (advanced)
    default:
      return "#090f46"; // Dark Charcoal (highest mastery)
  }
};

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

  let progressValue = 0;
  if (highThreshold === Infinity) {
    progressValue =
      ((progress - lowThreshold) / (progress + 100 - lowThreshold)) * 100;
  } else {
    progressValue =
      ((progress - lowThreshold) / (highThreshold - lowThreshold)) * 100;
  }

  return { lowThreshold, highThreshold, progressValue, level };
};
