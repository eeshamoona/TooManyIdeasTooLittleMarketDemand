import {
  FaPenNib,
  FaSeedling,
  FaLightbulb,
  FaClipboardCheck,
  FaMedal,
} from "react-icons/fa";
import {
  GiSkills,
  GiAchievement,
  GiMagnifyingGlass,
  GiPuzzle,
} from "react-icons/gi";
import { MdInsights, MdSelfImprovement, MdCreate } from "react-icons/md";
import { BsStars, BsFillBarChartFill } from "react-icons/bs";
import { RiMentalHealthFill } from "react-icons/ri";

export const questions = [
  {
    label: "Set the Stage",
    icon: FaPenNib, // Represents starting or engaging in creative writing
    question: "What kind of creative writer are you?",
    options: [
      {
        text: "I'm new to creative writing but excited to start",
        icon: FaSeedling, // Represents growth and new beginnings
      },
      {
        text: "I write sometimes but want to write more regularly.",
        icon: FaClipboardCheck, // Represents regularity and commitment
      },
      {
        text: "I like to write but could use fresh ideas.",
        icon: FaLightbulb, // Represents new ideas and inspiration
      },
      {
        text: "I write often and would appreciate feedback and insights.",
        icon: MdInsights, // Represents gaining deeper insights and feedback
      },
    ],
  },
  {
    label: "Gather Inspiration",
    icon: FaLightbulb, // Represents gathering inspiration and ideas
    question: "What inspires you to write the most?",
    options: [
      {
        text: "For personal growth and self-improvement.",
        icon: MdSelfImprovement, // Represents growth and self-improvement
      },
      {
        text: "To express my creativity and ideas.",
        icon: MdCreate, // Represents creativity and self-expression
      },
      {
        text: "To relax and unwind.",
        icon: RiMentalHealthFill, // Represents relaxation and mental well-being
      },
      {
        text: "To challenge myself and solve problems.",
        icon: GiPuzzle, // Represents problem-solving and challenges
      },
    ],
  },
  {
    label: "Define the Plot",
    icon: GiMagnifyingGlass, // Represents setting a direction or path
    question: "What's your main goal on your writing journey?",
    options: [
      {
        text: "Developing a regular writing habit.",
        icon: FaClipboardCheck, // Represents regular writing practices
      },
      {
        text: "Boosting my creativity and imagination.",
        icon: BsStars, // Represents creativity and imagination
      },
      {
        text: "Gaining insights into myself through reflection.",
        icon: MdInsights, // Represents self-discovery and insights
      },
      {
        text: "Improving my writing skills with holistic feedback.",
        icon: GiSkills, // Represents skill improvement
      },
    ],
  },
  {
    label: "Keep Writing",
    icon: FaMedal, // Represents motivation to continue or achieve milestones
    question: "What keeps you motivated to keep writing?",
    options: [
      {
        text: "Being promoted to new levels.",
        icon: BsFillBarChartFill, // Represents progress and leveling up
      },
      {
        text: "Discovering hidden milestones.",
        icon: GiAchievement, // Represents achievements and milestones
      },
      {
        text: "Tracking my stats over time.",
        icon: FaClipboardCheck, // Represents tracking progress
      },
      {
        text: "Revisiting my past writings.",
        icon: FaPenNib, // Represents reflecting on previous writings
      },
    ],
  },
];
