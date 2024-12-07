import { BsFillBarChartFill, BsStars } from "react-icons/bs";
import {
  FaClipboardCheck,
  FaLightbulb,
  FaMedal,
  FaPenNib,
  FaSeedling,
} from "react-icons/fa";
import {
  GiAchievement,
  GiMagnifyingGlass,
  GiPuzzle,
  GiSkills,
} from "react-icons/gi";
import { MdCreate, MdInsights, MdSelfImprovement } from "react-icons/md";
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

export const faqData = [
  {
    value: "prompt-authors",
    question: "Where do the prompts come from?",
    answer:
      "The prompts are manually curated to spark creativity and self-reflection. We focus on universal questions that anyone can enjoy. In the future, we might add AI-generated prompts or let the community contribute.",
  },
  {
    value: "application-developer",
    question: "Who developed this application?",
    answer:
      "Prompted was created and currently maintained by Eesha Moona, a software engineer. The app is built with Next.js, React, and Mantine, deployed on Vercel, and uses Supabase for authentication and database management.",
  },
  {
    value: "data-privacy",
    question: "How is my data handled?",
    answer:
      "We use Supabase to manage data securely, with encryption for data in transit and at rest. We only store what's necessary, and for AI interactions, no personal info is included—just the entry, the question, and any customizations in your profile.",
  },
  {
    value: "feedback-suggestions",
    question: "How can I provide feedback or suggest new features?",
    answer:
      "You can share feedback by logging in and clicking the feedback button in the top right corner, or suggest features by joining our discussion board on our repository on GitHub. We appreciate your support!",
  },
  {
    value: "subscription-plans",
    question: "Are there any subscription plans or in-app purchases?",
    answer:
      "Right now, Prompted is free with no in-app purchases. We want to keep it accessible for everyone. Down the road, we may add premium features for more tools and insights.",
  },
  {
    value: "ai-usage",
    question: "How does the app use AI?",
    answer:
      "AI helps in two ways: unblocking your while your write and providing feedback after you're done. For suggestions, it uses at least 100 characters of your text to help you continue writing. Feedback analyzes the final submission, keeping your identity private.",
  },
];
export const subtext = [
  "Writing isn’t about perfection; it’s about starting. With prompts anyone can answer, AI support, and stats to keep you motivated, you’ll find inspiration, growth, and support at every step.",
  "New to writing? No worries—start small and have fun. Our prompts, AI help, and progress tracking make writing simple, enjoyable, and rewarding.",
  "Looking to write more? With prompts that match your mood, AI suggestions to keep ideas flowing, and progress stats, it’s easy to make writing a daily habit.",
  "Love writing but need fresh ideas? Explore unique prompts, get AI suggestions, and track your progress. Find the inspiration you need for your next creative spark.",
  "Write often? This app is here to help you grow. With new prompts, detailed stats, and AI feedback, you’ll gain insights and watch your writing evolve one milestone at a time.",
];
