import { FaRegLightbulb, FaRegStar, FaRegCompass } from "react-icons/fa";
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

export const NEW_PROMPT_CATEGORIES = [
  {
    title: "Creative Spark",
    description: "For imaginative prompts that stimulate creativity.",
    notes: "High creativity, low grounded, about fiction",
    icon: FaRegLightbulb,
    color: "orange",
  },
  {
    title: "Adventure Tales",
    description: "For imaginative exploration or 'what if' adventures.",
    notes: "High creativity, medium grounded, about fiction",
    icon: FaRegCompass,
    color: "red",
  },
  {
    title: "Calm Vibes",
    description: "For prompts that paint immersive, vivid scenes ",
    notes: "High creativity, medium grounded, about non/fiction",
    icon: IoLeafOutline,
    color: "green",
  },
  {
    title: "Brain Puzzles",
    description: "For fun, problem-solving or critical thinking prompts.",
    notes: "High creativity, high grounded, about non-fiction",
    icon: IoExtensionPuzzleOutline,
    color: "blue",
  },
  {
    title: "Playtime Ideas",
    description: "For playful, fun, and whimsical writing prompts.",
    notes: "Medium creativity, low grounded, about fiction",
    icon: IoGameControllerOutline,
    color: "pink",
  },
  {
    title: "Goal Inspiration",
    description: "For light goal-setting and envisioning success.",
    notes: "Medium creativity, medium grounded, about non-fiction",
    icon: GoTrophy,
    color: "teal",
  },
  {
    title: "Future Dreams",
    description:
      "For prompts about an imagined future or future possibilities.",
    notes: "Medium creativity, high grounded, about fiction",
    icon: IoRocketOutline,
    color: "violet",
  },
  {
    title: "Empathy Challenge",
    description:
      "For fun exercises in understanding others in a lighthearted way.",
    notes: "Medium creativity, high grounded, about non-fiction",
    icon: LiaHandshake,
    color: "cyan",
  },
  {
    title: "Inner Thoughts",
    description: "For simple self-reflection and light personal musings.",
    notes: "Low creativity, low grounded, about non-fiction",
    icon: TfiThought,
    color: "indigo",
  },
  {
    title: "Confidence Boost",
    description:
      "For recognizing strengths and feeling empowered in a fun way.",
    notes: "Low creativity, medium grounded, about non-fiction",
    icon: FaRegStar,
    color: "yellow",
  },
  {
    title: "Gratitude Moments",
    description: "For recognizing small, positive things in life.",
    notes: "Low creativity, high grounded, about non-fiction",
    icon: HiOutlineEmojiHappy,
    color: "grape",
  },
];
