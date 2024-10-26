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
    text: "What kind of creative writer are you?",
    question: "Q1",
    options: [
      {
        text: "I'm new to creative writing but excited to start",
        icon: FaSeedling, // Represents growth and new beginnings
        choice: "A",
      },
      {
        text: "I write sometimes but want to write more regularly.",
        icon: FaClipboardCheck, // Represents regularity and commitment
        choice: "B",
      },
      {
        text: "I like to write but could use fresh ideas.",
        icon: FaLightbulb, // Represents new ideas and inspiration
        choice: "C",
      },
      {
        text: "I write often and would appreciate feedback and insights.",
        icon: MdInsights, // Represents gaining deeper insights and feedback
        choice: "D",
      },
    ],
  },
  {
    label: "Gather Inspiration",
    icon: FaLightbulb, // Represents gathering inspiration and ideas
    text: "What inspires you to write the most?",
    question: "Q2",
    options: [
      {
        text: "For personal growth and self-improvement.",
        icon: MdSelfImprovement, // Represents growth and self-improvement
        choice: "A",
      },
      {
        text: "To express my creativity and ideas.",
        icon: MdCreate, // Represents creativity and self-expression
        choice: "B",
      },
      {
        text: "To relax and unwind.",
        icon: RiMentalHealthFill, // Represents relaxation and mental well-being
        choice: "C",
      },
      {
        text: "To challenge myself and solve problems.",
        icon: GiPuzzle, // Represents problem-solving and challenges
        choice: "D",
      },
    ],
  },
  {
    label: "Define the Plot",
    icon: GiMagnifyingGlass, // Represents setting a direction or path
    text: "What's your main goal on your writing journey?",
    question: "Q3",
    options: [
      {
        text: "Developing a regular writing habit.",
        icon: FaClipboardCheck, // Represents regular writing practices
        choice: "A",
      },
      {
        text: "Boosting my creativity and imagination.",
        icon: BsStars, // Represents creativity and imagination
        choice: "B",
      },
      {
        text: "Gaining insights into myself through reflection.",
        icon: MdInsights, // Represents self-discovery and insights
        choice: "C",
      },
      {
        text: "Improving my writing skills with holistic feedback.",
        icon: GiSkills, // Represents skill improvement
        choice: "D",
      },
    ],
  },
  {
    label: "Keep Writing",
    icon: FaMedal, // Represents motivation to continue or achieve milestones
    text: "What keeps you motivated to keep writing?",
    question: "Q4",
    options: [
      {
        text: "Being promoted to new levels.",
        icon: BsFillBarChartFill, // Represents progress and leveling up
        choice: "A",
      },
      {
        text: "Discovering hidden milestones.",
        icon: GiAchievement, // Represents achievements and milestones
        choice: "B",
      },
      {
        text: "Tracking my stats over time.",
        icon: FaClipboardCheck, // Represents tracking progress
        choice: "C",
      },
      {
        text: "Revisiting my past writings.",
        icon: FaPenNib, // Represents reflecting on previous writings
        choice: "D",
      },
    ],
  },
];

export const subtext = [
  "Writing isn’t about perfection; it’s about starting. With prompts anyone can answer, AI support, and stats to keep you motivated, you’ll find inspiration, growth, and support at every step.",
  "New to writing? No worries—start small and have fun. Our prompts, AI help, and progress tracking make writing simple, enjoyable, and rewarding.",
  "Looking to write more? With prompts that match your mood, AI suggestions to keep ideas flowing, and progress stats, it’s easy to make writing a daily habit.",
  "Love writing but need fresh ideas? Explore unique prompts, get AI suggestions, and track your progress. Find the inspiration you need for your next creative spark.",
  "Write often? This app is here to help you grow. With new prompts, detailed stats, and AI feedback, you’ll gain insights and watch your writing evolve one milestone at a time.",
];
