import * as Ai from "react-icons/ai";
import * as Bi from "react-icons/bi";
import * as Bs from "react-icons/bs";
import * as Cg from "react-icons/cg";
import * as Fa from "react-icons/fa";
import * as Fa6 from "react-icons/fa6";
import * as Fi from "react-icons/fi";
import * as Gi from "react-icons/gi";
import * as Go from "react-icons/go";
import * as Hi from "react-icons/hi";
import * as Hi2 from "react-icons/hi2";
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import * as Lia from "react-icons/lia";
import * as Lu from "react-icons/lu";
import * as Md from "react-icons/md";
import * as Ri from "react-icons/ri";
import * as Rx from "react-icons/rx";
import * as Si from "react-icons/si";
import * as Tb from "react-icons/tb";
import * as Tfi from "react-icons/tfi";
import * as Vsc from "react-icons/vsc";
import * as Wi from "react-icons/wi";

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

const iconCache: { [key: string]: any } = {};

// Function to get the appropriate icon component based on the icon name
export const getIconComponent = (iconName: string) => {
  // Return cached icon if it exists
  if (iconCache[iconName]) {
    return iconCache[iconName];
  }

  // Handle special cases for Io5 and Heroicons v2 naming conventions
  if (iconName.startsWith("Io") && iconName.includes("Outline")) {
    iconCache[iconName] = Io5[iconName];
    return iconCache[iconName];
  }
  if (iconName.startsWith("Hi") && iconName.includes("2")) {
    iconCache[iconName] = Hi2[iconName];
    return iconCache[iconName];
  }

  // Split the icon name to determine the prefix for the icon set
  const [prefix] = iconName.split(/(?=[A-Z])/);

  // Mapping of icon prefixes to their respective libraries
  const iconSet: { [key: string]: any } = {
    Ai,
    Bi,
    Bs,
    Cg,
    Fa,
    Fa6,
    Fi,
    Gi,
    Go,
    Hi,
    Hi2,
    Io,
    Io5,
    Lia,
    Lu,
    Md,
    Ri,
    Rx,
    Si,
    Tb,
    Tfi,
    Vsc,
    Wi,
  };

  // Check for Font Awesome icons in both Fa and Fa6
  if (prefix === "Fa") {
    iconCache[iconName] = Fa[iconName] || Fa6[iconName];
    return iconCache[iconName];
  }

  // Check for Heroicons in both Hi and Hi2
  if (prefix === "Hi") {
    iconCache[iconName] = Hi[iconName] || Hi2[iconName];
    return iconCache[iconName];
  }

  // Retrieve the icon from the appropriate icon set and cache it
  iconCache[iconName] = iconSet[prefix]?.[iconName];
  return iconCache[iconName];
};

export const getBadgeColor = (level: number) => {
  switch (level) {
    case 1:
      return "#e7f5ff"; // Lightest Blue (starting level)
    case 2:
      return "#a5d8ff"; // Light Blue (progression)
    case 3:
      return "#4dabf7"; // Medium Blue (mid-level)
    case 4:
      return "#228be6"; // Darker Blue (higher)
    case 5:
      return "#1971c2"; // Deep Blue (advanced)
    case 6:
      return "#1864ab"; // Dark Blue (highest mastery)
    default:
      return "#090f46"; // Dark Charcoal (fallback)
  }
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
