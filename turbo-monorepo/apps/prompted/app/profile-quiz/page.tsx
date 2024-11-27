"use client";
import { useState } from "react";
import {
  Container,
  Title,
  Stepper,
  Grid,
  Text,
  Button,
  NumberInput,
  Radio,
  Stack,
  Group,
  Card,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { FaPencilAlt, FaBrain, FaBullseye } from "react-icons/fa";
import { updateProfile } from "./actions";

const questions = [
  {
    label: "Writing Goals",
    icon: FaBullseye,
    text: "What's your target word count per response?",
    question: "wordCount",
    options: [
      { value: "100", label: "Quick (100 words)" },
      { value: "250", label: "Standard (250 words)" },
      { value: "500", label: "Detailed (500 words)" },
      { value: "custom", label: "Custom" },
    ],
  },
  {
    label: "AI Feedback Style",
    icon: FaBrain,
    text: "How would you like your AI feedback?",
    question: "feedbackStyle",
    options: [
      {
        value: "gentle",
        label: "Friendly & Encouraging",
        description:
          "Focus on positives with gentle suggestions for improvement",
      },
      {
        value: "balanced",
        label: "Balanced & Constructive",
        description: "Equal focus on strengths and areas for improvement",
      },
      {
        value: "critical",
        label: "Critical & Detailed",
        description:
          "In-depth analysis with focus on improvement opportunities",
      },
    ],
  },
  {
    label: "Writing Focus",
    icon: FaPencilAlt,
    text: "What aspect of writing do you want to improve most?",
    question: "writingFocus",
    options: [
      {
        value: "creativity",
        label: "Creativity",
        description: "Enhance imaginative and unique expressions",
      },
      {
        value: "clarity",
        label: "Clarity",
        description: "Improve clear and effective communication",
      },
      {
        value: "structure",
        label: "Structure",
        description: "Better organization and flow of ideas",
      },
      {
        value: "style",
        label: "Style",
        description: "Develop a more engaging writing voice",
      },
    ],
  },
];

export default function ProfileQuiz() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({
    wordCount: "250",
    feedbackStyle: "balanced",
    writingFocus: "creativity",
  });
  const [customWordCount, setCustomWordCount] = useState<number | "">(250);
  const router = useRouter();

  const handleCustomWordCount = (value: string | number) => {
    setCustomWordCount(value === "" ? "" : Number(value));
  };

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };
  const nextStep = async () => {
    if (activeStep < questions.length - 1) {
      setActiveStep((current) => current + 1);
    } else {
      try {
        // Save profile preferences
        const finalAnswers = {
          ...answers,
          wordCount:
            answers.wordCount === "custom"
              ? customWordCount.toString()
              : answers.wordCount,
        };

        const { success, profile } = await updateProfile(finalAnswers);
        if (success) {
          router.push("/write");
        } else {
          console.error("Failed to update profile:", profile);
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        Customize Your Writing Experience
      </Title>

      <Stepper active={activeStep} onStepClick={setActiveStep} mb="xl">
        {questions.map((q, index) => (
          <Stepper.Step
            key={index}
            label={q.label}
            icon={<q.icon size={18} />}
          />
        ))}
      </Stepper>

      <Card withBorder p="xl" radius="md">
        <Stack>
          <Title order={2}>{questions[activeStep].text}</Title>

          {questions[activeStep].question === "wordCount" && (
            <>
              <Radio.Group
                value={answers.wordCount}
                onChange={(value) =>
                  handleAnswerChange(questions[activeStep].question, value)
                }
              >
                <Stack mt="md">
                  {questions[activeStep].options.map((option) => (
                    <Radio
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Stack>
              </Radio.Group>
              {answers.wordCount === "custom" && (
                <NumberInput
                  label="Custom word count"
                  value={customWordCount}
                  onChange={handleCustomWordCount}
                  min={50}
                  max={2000}
                  step={50}
                />
              )}
            </>
          )}

          {questions[activeStep].question !== "wordCount" && (
            <Radio.Group
              value={answers[questions[activeStep].question]}
              onChange={(value) =>
                handleAnswerChange(questions[activeStep].question, value)
              }
            >
              <Stack mt="md">
                {questions[activeStep].options.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    label={
                      <div>
                        <Text fw={500}>{option.label}</Text>
                        <Text size="sm" c="dimmed">
                          {option.description}
                        </Text>
                      </div>
                    }
                  />
                ))}
              </Stack>
            </Radio.Group>
          )}

          <Group justify="flex-end" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button onClick={nextStep}>
              {activeStep === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
