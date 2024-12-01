"use client";
import {
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Slider,
  Stack,
  Stepper,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Profile } from "../write/components/display";
import { updateProfile } from "./actions";
import { getWordCountDescription, profileQuizQuestions } from "./constants";

//TODO: If the user has already filled out the quiz we should add a button to cancel the quiz and go back
// to the profile page with their original profile

export default function ProfileQuiz() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Profile>({
    targetWordCount: 250,
    feedbackPersona: "",
    motivatingFeedback: "",
  });
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

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

  const skipQuiz = () => {
    router.push("/profile");
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
        <Stack gap="xs">
          <Title ta="center">{answers.targetWordCount} words</Title>
          <Text size="md" ta="center" c="dimmed">
            {getWordCountDescription(answers.targetWordCount)}
          </Text>
          <Slider
            value={answers.targetWordCount as number}
            onChange={(value) => handleAnswerChange("targetWordCount", value)}
            min={100}
            max={1000}
            step={50}
            mt="lg"
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
              p="md"
            >
              <Group justify="space-between">
                <Text size="sm" ta="center" tt="uppercase" fw={500} c="dimmed">
                  {option.label}
                </Text>
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
              </Group>

              <Group align="flex-end" mt={"sm"}>
                <Text size="lg" tt="capitalize" fw={500}>
                  {option.value}
                </Text>
              </Group>

              <Text size="xs" c="dimmed" lineClamp={2} mt={5}>
                {option.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      );
    }
  };

  return (
    <Container size="lg">
      <Stack gap="xl" mt="xl" justify="start">
        <Stack gap="0" align="center">
          <Title order={2} ta="center">
            Let's Make This Space Yours
          </Title>
          <Text c="dimmed" size="md" ta="center">
            Answer a few quick questions to customize your perfect writing
            environment
          </Text>
        </Stack>

        <Stepper radius="sm" size="sm" active={activeStep}>
          {profileQuizQuestions.map((q, index) => (
            <Stepper.Step
              key={index}
              label={q.label}
              icon={q.icon && <q.icon size={20} />}
            />
          ))}
        </Stepper>

        <Card
          radius="sm"
          p="xs"
          bg={colorScheme === "light" ? theme.colors.gray[0] : undefined}
        >
          <Text size="lg" ta="center">
            {profileQuizQuestions[activeStep].text}
          </Text>
        </Card>

        <Paper radius="md">
          <Stack gap="lg">
            {renderQuestionContent()}

            <Group justify="space-between" mt="md">
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
        </Paper>

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
