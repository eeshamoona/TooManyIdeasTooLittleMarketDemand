import {
  FaDove,
  FaQuestionCircle,
  FaRegCompass,
  FaRegLightbulb,
  FaRegStar,
} from "react-icons/fa";
import { FaSpaceAwesome } from "react-icons/fa6";
import { LuGem, LuShrink, LuWholeWord } from "react-icons/lu";
import {
  GiEagleHead,
  GiFinch,
  GiGems,
  GiLeafSwirl,
  GiMagicLamp,
  GiMagicPalm,
  GiOwl,
  GiPuzzle,
  GiTurtleShell,
} from "react-icons/gi";
import { BsSpeedometer } from "react-icons/bs";
import {
  TbBallpen,
  TbLetterCaseUpper,
  TbUserHexagon,
  TbUserStar,
} from "react-icons/tb";
import { MdManageSearch, MdOutlineCelebration } from "react-icons/md";
import {
  IoExtensionPuzzleOutline,
  IoGameControllerOutline,
  IoLeafOutline,
  IoRocketOutline,
} from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { LiaHandshake } from "react-icons/lia";
import { TfiThought } from "react-icons/tfi";
import { HiOutlineEmojiHappy } from "react-icons/hi";

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
  BsSpeedometer: BsSpeedometer,
  FaDove: FaDove,
  FaQuestionCircle: FaQuestionCircle,
  FaRegCompass: FaRegCompass,
  FaRegLightbulb: FaRegLightbulb,
  FaRegStar: FaRegStar,
  FaSpaceAwesome: FaSpaceAwesome,
  GiEagleHead: GiEagleHead,
  GiFinch: GiFinch,
  GiGems: GiGems,
  GiLeafSwirl: GiLeafSwirl,
  GiMagicLamp: GiMagicLamp,
  GiMagicPalm: GiMagicPalm,
  GiOwl: GiOwl,
  GiPuzzle: GiPuzzle,
  GiTurtleShell: GiTurtleShell,
  GoTrophy: GoTrophy,
  HiOutlineEmojiHappy: HiOutlineEmojiHappy,
  IoExtensionPuzzleOutline: IoExtensionPuzzleOutline,
  IoGameControllerOutline: IoGameControllerOutline,
  IoLeafOutline: IoLeafOutline,
  IoRocketOutline: IoRocketOutline,
  LiaHandshake: LiaHandshake,
  LuGem: LuGem,
  LuShrink: LuShrink,
  LuWholeWord: LuWholeWord,
  MdManageSearch: MdManageSearch,
  MdOutlineCelebration: MdOutlineCelebration,
  TbLetterCaseUpper: TbLetterCaseUpper,
  TbUserHexagon: TbUserHexagon,
  TbUserStar: TbUserStar,
  TfiThought: TfiThought,
  TbBallpen: TbBallpen,
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
