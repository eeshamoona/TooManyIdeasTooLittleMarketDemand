import { BsSpeedometer, BsTrophy } from "react-icons/bs";
import {
  FaAward,
  FaDove,
  FaQuestionCircle,
  FaRegCompass,
  FaRegLightbulb,
  FaRegStar,
} from "react-icons/fa";
import { FaSpaceAwesome } from "react-icons/fa6";
import {
  GiEagleHead,
  GiFinch,
  GiGems,
  GiLaurelsTrophy,
  GiLeafSwirl,
  GiMagicLamp,
  GiMagicPalm,
  GiOwl,
  GiPuzzle,
  GiRibbonMedal,
  GiTurtleShell,
} from "react-icons/gi";
import { GoTrophy } from "react-icons/go";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoMdTimer } from "react-icons/io";
import {
  IoExtensionPuzzleOutline,
  IoGameControllerOutline,
  IoLeafOutline,
  IoRocketOutline,
} from "react-icons/io5";
import { LiaHandshake, LiaTrophySolid } from "react-icons/lia";
import { LuGem, LuShrink, LuWholeWord } from "react-icons/lu";
import {
  MdFingerprint,
  MdManageSearch,
  MdOutlineCelebration,
  MdOutlineTimer10,
} from "react-icons/md";
import {
  TbAlignJustified,
  TbBallpen,
  TbLetterCaseUpper,
  TbUserHexagon,
  TbUserStar,
} from "react-icons/tb";
import { TfiThought } from "react-icons/tfi";
import {
  WiTime1,
  WiTime10,
  WiTime2,
  WiTime3,
  WiTime4,
  WiTime5,
  WiTime6,
  WiTime7,
  WiTime8,
  WiTime9,
} from "react-icons/wi";

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

// export const icon_map = {
//   BsSpeedometer: BsSpeedometer,
//   FaDove: FaDove,
//   FaQuestionCircle: FaQuestionCircle,
//   FaRegCompass: FaRegCompass,
//   FaRegLightbulb: FaRegLightbulb,
//   FaRegStar: FaRegStar,
//   FaSpaceAwesome: FaSpaceAwesome,
//   GiEagleHead: GiEagleHead,
//   GiFinch: GiFinch,
//   GiGems: GiGems,
//   GiLeafSwirl: GiLeafSwirl,
//   GiMagicLamp: GiMagicLamp,
//   GiMagicPalm: GiMagicPalm,
//   GiOwl: GiOwl,
//   GiPuzzle: GiPuzzle,
//   GiTurtleShell: GiTurtleShell,
//   GoTrophy: GoTrophy,
//   HiOutlineEmojiHappy: HiOutlineEmojiHappy,
//   IoExtensionPuzzleOutline: IoExtensionPuzzleOutline,
//   IoGameControllerOutline: IoGameControllerOutline,
//   IoLeafOutline: IoLeafOutline,
//   IoRocketOutline: IoRocketOutline,
//   LiaHandshake: LiaHandshake,
//   LuGem: LuGem,
//   LuShrink: LuShrink,
//   LuWholeWord: LuWholeWord,
//   MdManageSearch: MdManageSearch,
//   MdOutlineCelebration: MdOutlineCelebration,
//   TbLetterCaseUpper: TbLetterCaseUpper,
//   TbUserHexagon: TbUserHexagon,
//   TbUserStar: TbUserStar,
//   TfiThought: TfiThought,
//   TbBallpen: TbBallpen,
//   TbAlignJustified: TbAlignJustified,
//   MdFingerprint: MdFingerprint,
//   IoMdTimer: IoMdTimer,
//   GiRibbonMedal: GiRibbonMedal,
//   FaAward: FaAward,
//   BsTrophy: BsTrophy,
//   LiaTrophySolid: LiaTrophySolid,
//   GiLaurelsTrophy: GiLaurelsTrophy,
//   MdOutlineTimer10: MdOutlineTimer10,
//   WiTime1: WiTime1,
//   WiTime2: WiTime2,
//   WiTime3: WiTime3,
//   WiTime4: WiTime4,
//   WiTime5: WiTime5,
//   WiTime6: WiTime6,
//   WiTime7: WiTime7,
//   WiTime8: WiTime8,
//   WiTime9: WiTime9,
//   WiTime10: WiTime10,
// };

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
