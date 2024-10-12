import {
  FaRegLightbulb,
  FaRegHeart,
  FaRegStar,
  FaRegCompass,
} from "react-icons/fa";
import { TfiThought } from "react-icons/tfi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { GoTrophy } from "react-icons/go";
import {
  IoLeafOutline,
  IoGameControllerOutline,
  IoExtensionPuzzleOutline,
  IoRocketOutline,
} from "react-icons/io5";
import { LiaHandshake } from "react-icons/lia";
import { FaRegMoon, FaGlobe, FaMap } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { MdBrush } from "react-icons/md";

export const OLD_PROMPT_CATEGORIES = [
  {
    title: "Dreams",
    description: "Imagine yourself in fantastical scenarios.",
    icon: FaRegMoon,
  },
  {
    title: "Growth",
    description: "Reflect on your personal experiences and growth.",
    icon: IoLeafOutline,
  },
  {
    title: "Imagination",
    description: "Envision others in creative, fictional ways.",
    icon: FaRegLightbulb,
  },
  {
    title: "Connection",
    description: "Reflect on real connections with others.",
    icon: LiaHandshake,
  },
  {
    title: "Invention",
    description: "Imagine creative possibilities with objects.",
    icon: FaGears,
  },
  {
    title: "Creations",
    description: "Reflect on real objects and their significance.",
    icon: MdBrush,
  },
  {
    title: "Worlds",
    description: "Imagine new, fantastical places and environments.",
    icon: FaGlobe,
  },
  {
    title: "Spaces",
    description: "Reflect on meaningful real places in your life.",
    icon: FaMap,
  },
];

export const NEW_PROMPT_CATEGORIES = [
  {
    title: "Creative Spark",
    description: "For imaginative prompts that stimulate creativity.",
    icon: FaRegLightbulb,
  },
  {
    title: "Inner Thoughts",
    description: "For simple self-reflection and light personal musings.",
    icon: TfiThought,
  },
  {
    title: "Gratitude Moments",
    description: "For recognizing small, positive things in life.",
    icon: HiOutlineEmojiHappy,
  },
  {
    title: "Goal Inspiration",
    description: "For light goal-setting and envisioning success.",
    icon: GoTrophy,
  },
  {
    title: "Calm Vibes",
    description:
      "For prompts that encourage relaxation and a peaceful mindset.",
    icon: IoLeafOutline,
  },
  {
    title: "Feel-Good Fun",
    description:
      "For light emotional exploration, focused on positivity and happiness.",
    icon: FaRegHeart,
  },
  {
    title: "Playtime Ideas",
    description: "For playful, fun, and whimsical writing prompts.",
    icon: IoGameControllerOutline,
  },
  {
    title: "Brain Puzzles",
    description: "For fun, problem-solving or critical thinking prompts.",
    icon: IoExtensionPuzzleOutline,
  },
  {
    title: "Confidence Boost",
    description:
      "For recognizing strengths and feeling empowered in a fun way.",
    icon: FaRegStar,
  },
  {
    title: "Empathy Challenge",
    description:
      "For fun exercises in understanding others in a lighthearted way.",
    icon: LiaHandshake,
  },
  {
    title: "Future Dreams",
    description:
      "For wholesome and fun vision-based prompts without being too deep.",
    icon: IoRocketOutline,
  },
  {
    title: "Adventure Tales",
    description: "For imaginative exploration or 'what if' adventures.",
    icon: FaRegCompass,
  },
];
