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
    description: "Quirky, imaginative prompts for creative thinking.",
    notes: "High creativity, low grounded, about fiction",
    icon: FaRegLightbulb,
    color: "orange",
  },
  {
    title: "Adventure Tales",
    description: "Story-driven adventures in imaginative worlds.",
    notes: "High creativity, medium grounded, about fiction",
    icon: FaRegCompass,
    color: "red",
  },
  {
    title: "Calm Vibes",
    description:
      "Grounded, vivid scene-building for a calm, visual experience.",
    notes: "High creativity, medium grounded, about non/fiction",
    icon: IoLeafOutline,
    color: "green",
  },
  {
    title: "Brain Puzzles",
    description:
      "Challenge your wits with creative solutions and inventive designs.",
    notes: "High creativity, high grounded, about non-fiction",
    icon: IoExtensionPuzzleOutline,
    color: "blue",
  },
  {
    title: "Playful Ideas",
    description: "Whimsical prompts for playful scenarios and fun ideas.",
    notes: "Medium creativity, low grounded, about fiction",
    icon: IoGameControllerOutline,
    color: "pink",
  },
  {
    title: "Goal Inspiration",
    description: "Joy-based growth and personal development.",
    notes: "Medium creativity, medium grounded, about non-fiction",
    icon: GoTrophy,
    color: "teal",
  },
  {
    title: "Future Dreams",
    description:
      "Imagine ambitious future possibilities and your role in them.",
    notes: "Medium creativity, high grounded, about fiction",
    icon: IoRocketOutline,
    color: "violet",
  },
  {
    title: "Empathy Challenge",
    description:
      "Lighthearted prompts for seeing life from others’ perspectives.",
    notes: "Medium creativity, high grounded, about non-fiction",
    icon: LiaHandshake,
    color: "cyan",
  },
  {
    title: "Inner Thoughts",
    description:
      "Self-reflective prompts to explore your thoughts and opinions.",
    notes: "Low creativity, low grounded, about non-fiction",
    icon: TfiThought,
    color: "indigo",
  },
  {
    title: "Confidence Boost",
    description:
      "Empowering prompts to lift your self-esteem and celebrate you.",
    notes: "Low creativity, medium grounded, about non-fiction",
    icon: FaRegStar,
    color: "yellow",
  },
  {
    title: "Gratitude Moments",
    description: "Reflect on life's small, positive moments with gratitude.",
    notes: "Low creativity, high grounded, about non-fiction",
    icon: HiOutlineEmojiHappy,
    color: "grape",
  },
];
