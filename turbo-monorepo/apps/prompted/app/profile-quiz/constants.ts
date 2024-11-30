import {
  FaBalanceScale,
  FaBook,
  FaBrain,
  FaBullseye,
  FaCog,
  FaCompass,
  FaExclamationCircle,
  FaEye,
  FaFlag,
  FaHeart,
  FaLightbulb,
  FaMagic,
  FaPencilAlt,
  FaQuestion,
  FaRegClock,
  FaRunning,
  FaStar,
  FaStepForward,
  FaUserGraduate,
} from "react-icons/fa";

export const profileQuizQuestions = [
  {
    label: "Writing Goals",
    icon: FaBullseye,
    text: "What's your target word count per response?",
    question: "targetWordCount",
    options: [
      {
        value: "100",
        label: "Quick (100 words)",
        description: "Quick, actionable fixes to level up your writing.",
        icon: FaRegClock,
      },
      {
        value: "250",
        label: "Standard (250 words)",
        description: "A mix of praise and constructive guidance.",
        icon: FaBook,
      },
      {
        value: "500",
        label: "Detailed (500 words)",
        description: "Deep dive into your writing with detailed feedback.",
        icon: FaRunning,
      },
      {
        value: "750",
        label: "Extensive (750 words)",
        description:
          "Comprehensive feedback covering all aspects of your writing.",
        icon: FaBook,
      },
      {
        value: "custom",
        label: "Custom",
        description: "Tailor your feedback to your specific needs.",
        icon: FaCog,
      },
    ],
  },
  {
    label: "AI Feedback Style",
    icon: FaBrain,
    text: "How would you like your AI feedback?",
    question: "feedbackPersona",
    options: [
      {
        value: "gentle",
        label: "Cheerleader",
        description: "Celebrate wins and gently suggest ways to grow.",
        icon: FaHeart,
      },
      {
        value: "balanced",
        label: "Coach",
        description: "A mix of praise and constructive guidance.",
        icon: FaBalanceScale,
      },
      {
        value: "critical",
        label: "Critic",
        description: "Direct, detailed advice to help you improve fast.",
        icon: FaExclamationCircle,
      },
      {
        value: "inspirational",
        label: "Muse",
        description: "Spark creative ideas and encourage exploration.",
        icon: FaMagic,
      },
      {
        value: "efficient",
        label: "Editor",
        description: "Quick, actionable fixes to level up your writing.",
        icon: FaPencilAlt,
      },
      {
        value: "reflective",
        label: "Mentor",
        description: "Focus on long-term growth with reflective insights.",
        icon: FaUserGraduate,
      },
    ],
  },
  {
    label: "Motivating Feedback",
    icon: FaLightbulb,
    text: "What kind of feedback motivates you most?",
    question: "motivatingFeedback",
    options: [
      {
        value: "clearGoal",
        label: "A clear goal for next time",
        description: "Set an overarching target to focus on improving.",
        icon: FaFlag,
      },
      {
        value: "actionableStep",
        label: "An actionable step to improve",
        description: "Get specific advice you can apply immediately.",
        icon: FaStepForward,
      },
      {
        value: "question",
        label: "A question to explore",
        description:
          "Receive a thought-provoking question to spark creativity.",
        icon: FaQuestion,
      },
      {
        value: "highlightStrengths",
        label: "Highlighting my strengths",
        description: "Learn what's working well and how to build on it.",
        icon: FaStar,
      },
      {
        value: "newPerspective",
        label: "A new perspective to consider",
        description: "See your work from a different or fresh angle.",
        icon: FaEye,
      },
      {
        value: "bigPicture",
        label: "A reflection on the big picture",
        description: "Connect your writing to the overall theme or purpose.",
        icon: FaCompass,
      },
    ],
  },
];
