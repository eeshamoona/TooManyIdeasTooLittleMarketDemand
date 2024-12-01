import { AiFillNotification } from "react-icons/ai";
import { BsQuestionLg } from "react-icons/bs";
import { FaBook, FaCog, FaRegClock, FaRunning } from "react-icons/fa";
import { GiGreekTemple, GiMeditation, GiWhistle } from "react-icons/gi";
import { GrTask } from "react-icons/gr";
import { IoEarth } from "react-icons/io5";
import { LiaDumbbellSolid } from "react-icons/lia";
import { LuGoal } from "react-icons/lu";
import { MdRunningWithErrors } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import {
  TbEyeSearch,
  TbMessageHeart,
  TbTargetArrow,
  TbUser,
} from "react-icons/tb";

export const profileQuizQuestions = [
  {
    label: "Word Count",
    icon: TbTargetArrow,
    text: "How long would you like your journal entries to be?",
    question: "targetWordCount",
    options: [
      {
        value: "100",
        label: "Quick (100 words)",
        description: "Perfect for jotting down initial ideas",
        icon: FaRegClock,
      },
      {
        value: "250",
        label: "Standard (250 words)",
        description: "Balanced for clarity and focus",
        icon: FaBook,
      },
      {
        value: "500",
        label: "Detailed (500 words)",
        description: "Explore ideas with more depth",
        icon: FaRunning,
      },
      {
        value: "750",
        label: "Extensive (750 words)",
        description: "Dive into detailed storytelling or analysis",
        icon: FaBook,
      },
      {
        value: "custom",
        label: "Custom",
        description: "Adjust the word count to suit your needs",
        icon: FaCog,
      },
    ],
  },
  {
    label: "Feedback Persona",
    icon: TbUser,
    text: "What kind of writing companion would help you thrive?",
    question: "feedbackPersona",
    options: [
      {
        value: "gentle",
        label: "Cheerleader",
        description: "Encouraging feedback to celebrate progress",
        icon: AiFillNotification,
      },
      {
        value: "balanced",
        label: "Coach",
        description: "Practical guidance with a mix of praise and direction",
        icon: GiWhistle,
      },
      {
        value: "critical",
        label: "Critic",
        description: "Constructive, detailed feedback for big improvement",
        icon: MdRunningWithErrors,
      },
      {
        value: "inspirational",
        label: "Muse",
        description: "Creative ideas to inspire your next entry",
        icon: GiGreekTemple,
      },
      {
        value: "efficient",
        label: "Editor",
        description: "Quick suggestions to refine your writing now",
        icon: RiEdit2Fill,
      },
      {
        value: "reflective",
        label: "Guru",
        description: "Guiding questions for deeper self-reflection",
        icon: GiMeditation,
      },
    ],
  },
  {
    label: "Motivating Feedback",
    icon: TbMessageHeart,
    text: "Which feedback style helps you grow the most?",
    question: "motivatingFeedback",
    options: [
      {
        value: "goal",
        label: "Clear Goal",
        description: "Stay focused with a specific target to aim for",
        icon: LuGoal,
      },
      {
        value: "action",
        label: "Next Steps",
        description: "Practical advice you can apply right away",
        icon: GrTask,
      },
      {
        value: "question",
        label: "Thought-Provoking Question",
        description: "Open-ended prompts to fuel creativity",
        icon: BsQuestionLg,
      },
      {
        value: "strengths",
        label: "Highlight Strengths",
        description: "Build confidence by focusing the positives",
        icon: LiaDumbbellSolid,
      },
      {
        value: "perspective",
        label: "New Perspective",
        description: "Discover fresh ways to approach your work",
        icon: TbEyeSearch,
      },
      {
        value: "vision",
        label: "Big Picture",
        description: "Connect your ideas to a larger vision or purpose",
        icon: IoEarth,
      },
    ],
  },
];

export const getWordCountDescription = (count: number): string => {
  if (count <= 200)
    return `Quick Answer - Great for brainstorming or a vivid moment.`;
  if (count <= 400) return `Short Story - A concise, focused response.`;
  if (count <= 650) return `Developed Tale - Enough room to explore ideas.`;
  if (count <= 850)
    return `Rich Narrative - Add depth and detail to your story.`;
  return `Epic Story - Fully immerse yourself in a complete world.`;
};
