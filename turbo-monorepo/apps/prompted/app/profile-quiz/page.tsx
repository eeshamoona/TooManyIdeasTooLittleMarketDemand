"use client";
import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Slider,
  Stack,
  Stepper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Profile } from "../write/components/display";
import { updateProfile } from "./actions";
import { profileQuizQuestions } from "./constants";

export default function ProfileQuiz() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Profile>({
    targetWordCount: 250,
    feedbackPersona: "",
    motivatingFeedback: "",
  });
  const router = useRouter();
  const theme = useMantineTheme();

  const handleAnswerChange = (question: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const isCurrentStepValid = () => {
    const currentQuestion = profileQuizQuestions[activeStep];
    const currentAnswer =
      answers[currentQuestion.question as keyof typeof answers];

    // Word count always has a default value, so it's always valid
    if (currentQuestion.question === "targetWordCount") return true;

    // For other questions, check if there's a selected value
    return Boolean(currentAnswer);
  };

  const skipQuiz = async () => {
    const defaultAnswers = {
      targetWordCount: 250,
      feedbackPersona: "balanced",
      motivatingFeedback: "clearGoal",
    };

    try {
      const { success } = await updateProfile(defaultAnswers);
      if (success) {
        router.push("/write");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const nextStep = async () => {
    if (!isCurrentStepValid()) {
      return; // Don't proceed if current step is invalid
    }

    if (activeStep < profileQuizQuestions.length - 1) {
      setActiveStep((current) => current + 1);
    } else {
      try {
        const { success } = await updateProfile(answers);
        if (success) {
          router.push("/write");
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  const renderQuestionContent = () => {
    const currentQuestion = profileQuizQuestions[activeStep];

    if (currentQuestion.question === "targetWordCount") {
      return (
        <Stack
          gap="xl"
          style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
        >
          <Slider
            value={answers.targetWordCount as number}
            onChange={(value) => handleAnswerChange("targetWordCount", value)}
            min={100}
            max={1000}
            step={50}
            mt="xl"
            marks={[
              { value: 100, label: "100" },
              { value: 250, label: "250" },
              { value: 500, label: "500" },
              { value: 750, label: "750" },
              { value: 1000, label: "1000" },
            ]}
            styles={(theme) => ({
              mark: {
                width: "2px",
                height: "8px",
                borderRadius: 0,
                transform: "translateX(-1px) translateY(2px)",
              },
              markLabel: {
                fontSize: theme.fontSizes.xs,
                marginBottom: 5,
                marginTop: 0,
              },
            })}
          />
          <Text size="lg" ta="center" fw={500}>
            {(() => {
              const count = answers.targetWordCount;
              if (count <= 100)
                return `Brief Response (${count} words) - Perfect for quick thoughts`;
              if (count <= 350)
                return `Short Article (${count} words) - Ideal for clear, concise ideas`;
              if (count <= 650)
                return `Full Article (${count} words) - Room to develop your thoughts`;
              if (count <= 850)
                return `In-Depth Piece (${count} words) - Space for rich detail`;
              return `Comprehensive Essay (${count} words) - Full exploration of your topic`;
            })()}
          </Text>
        </Stack>
      );
    } else {
      return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: "sm", sm: "md" }}
        >
          {currentQuestion.options.map((option) => (
            <Card
              key={option.value}
              shadow="sm"
              radius="md"
              withBorder
              style={{
                cursor: "pointer",
                borderColor:
                  answers[currentQuestion.question] === option.value
                    ? theme.colors.blue[6]
                    : "",
                borderWidth: 2,
              }}
              onClick={() =>
                handleAnswerChange(currentQuestion.question, option.value)
              }
            >
              <Stack align="center" gap={0}>
                {option.icon && (
                  <option.icon
                    size={24}
                    color={
                      answers[currentQuestion.question] === option.value
                        ? theme.colors.blue[6]
                        : ""
                    }
                  />
                )}
                <Text size="md" fw={500} mt="xs">
                  {option.label}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  {option.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      );
    }
  };

  return (
    <Container size="lg">
      <Stack gap="xl" mt="xl" justify="start">
        <Stack gap="sm" align="center">
          <Title order={2} ta="center">
            Let's Make This Space Yours
          </Title>
          <Text c="dimmed" size="md" ta="center">
            A few quick questions to create your perfect writing environment.
          </Text>
        </Stack>

        <Stepper active={activeStep} mx="xl" w="100%">
          {profileQuizQuestions.map((q, index) => (
            <Stepper.Step
              key={index}
              label={q.label}
              icon={q.icon && <q.icon size={18} />}
            />
          ))}
        </Stepper>

        <Card withBorder radius="md" w="100%" padding={"sm"}>
          <Stack gap="lg">
            <Title order={2} ta="center">
              {profileQuizQuestions[activeStep].text}
            </Title>

            {renderQuestionContent()}

            <Group justify="space-between">
              <Group>
                <Button
                  variant="default"
                  onClick={prevStep}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
              </Group>
              <Button onClick={nextStep} disabled={!isCurrentStepValid()}>
                {activeStep === profileQuizQuestions.length - 1
                  ? "Start Writing"
                  : "Next"}
              </Button>
            </Group>
          </Stack>
        </Card>

        <Button
          variant="subtle"
          color="red"
          onClick={skipQuiz}
          leftSection={<Text size="sm">→</Text>}
        >
          Skip for now, I'll customize later
        </Button>
      </Stack>
    </Container>
  );
}
