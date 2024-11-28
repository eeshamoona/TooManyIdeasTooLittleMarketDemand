"use client";
import { useState } from "react";
import {
  Container,
  Title,
  Stepper,
  Text,
  Button,
  Slider,
  Stack,
  Group,
  Card,
  SimpleGrid,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";
import { profileQuizQuestions } from "./constants";
import { IconType } from "react-icons";

export default function ProfileQuiz() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({
    wordCount: 250,
    feedbackStyle: "balanced",
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

  const nextStep = async () => {
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

    if (currentQuestion.question === "wordCount") {
      return (
        <Stack gap="xl" style={{ width: "100%" }}>
          <Text size="lg" fw={500}>
            {answers.wordCount} words
          </Text>
          <Slider
            value={answers.wordCount as number}
            onChange={(value) => handleAnswerChange("wordCount", value)}
            min={100}
            max={1000}
            step={50}
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
        <SimpleGrid cols={3} spacing="md">
          {currentQuestion.options.map((option) => (
            <Card
              key={option.value}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              style={{
                cursor: "pointer",
                borderColor:
                  answers[currentQuestion.question] === option.value
                    ? theme.colors.blue[6]
                    : theme.colors.gray[3],
              }}
              onClick={() =>
                handleAnswerChange(currentQuestion.question, option.value)
              }
            >
              <Stack align="center" gap="xs">
                {option.icon && (
                  <option.icon size={24} color={theme.colors.blue[6]} />
                )}
                <Text size="sm" fw={500}>
                  {option.label}
                </Text>
                <Text size="xs" c="dimmed" ta="center">
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
      <Title order={1} mb="xl">
        Customize Your Writing Experience
      </Title>

      <Stepper active={activeStep} onStepClick={setActiveStep} mb="xl">
        {profileQuizQuestions.map((q, index) => (
          <Stepper.Step
            key={index}
            label={q.label}
            icon={q.icon && <q.icon size={18} />}
          />
        ))}
      </Stepper>

      <Card withBorder p="xl" radius="md">
        <Stack gap="xl">
          <Title order={2}>{profileQuizQuestions[activeStep].text}</Title>

          {renderQuestionContent()}

          <Group justify="apart" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button onClick={nextStep}>
              {activeStep === profileQuizQuestions.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
