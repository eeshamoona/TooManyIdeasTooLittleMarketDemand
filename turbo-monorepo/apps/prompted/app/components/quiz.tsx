import React, { useState } from "react";
import {
  Stepper,
  Button,
  Container,
  Grid,
  Card,
  Box,
  Text,
  Title,
  useMantineTheme,
  Flex,
} from "@mantine/core";
import { questions } from "./data";

interface QuizProps {
  onQuizCompleted: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onQuizCompleted }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const theme = useMantineTheme();

  const nextStep = () =>
    setActiveStep((current) => Math.min(current + 1, questions.length - 1));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  const handleAnswerChange = (value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [activeStep]: value,
    }));
  };

  const handleQuizCompletion = () => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    onQuizCompleted();
  };

  const handleSkipQuiz = () => {
    localStorage.setItem("quizAnswers", JSON.stringify(null));
    onQuizCompleted();
  };

  return (
    <Container size="md" style={{ marginTop: "40px" }}>
      <Title
        style={{
          width: "75%",
        }}
        order={1}
      >
        Hey! Let's Explore Your Creative Side
      </Title>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "space-between" }}
        mb="xl"
      >
        <Text size="md" c="dimmed">
          Take a moment to discover what inspires you and makes your writing
          journey meaningful.
        </Text>
        <Button variant="light" color="red" onClick={handleSkipQuiz}>
          Quick Skip
        </Button>
      </Flex>
      <Stepper
        radius="sm"
        size="xs"
        active={activeStep}
        onStepClick={setActiveStep}
        style={{
          marginBottom: "20px",
        }}
      >
        {questions.map((q, index) => (
          <Stepper.Step
            style={{
              flexWrap: "nowrap",
            }}
            key={index}
            label={q.label}
            icon={<q.icon size={14} />}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <Title order={2} style={{ marginBottom: "20px" }}>
                {q.question}
              </Title>
              <Grid gutter="md" style={{ marginTop: "20px" }}>
                {q.options.map((option, idx) => (
                  <Grid.Col
                    key={idx}
                    span={{ base: 12, sm: 6, md: 6, lg: 3 }}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      onClick={() => handleAnswerChange(option.text)}
                      padding="lg"
                      withBorder
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = theme.shadows.md;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        backgroundColor:
                          answers[activeStep] === option.text
                            ? "var(--mantine-color-blue-light-hover)"
                            : "",
                        borderColor:
                          answers[activeStep] === option.text
                            ? "var(--mantine-color-blue-light-color)"
                            : "",
                        borderWidth:
                          answers[activeStep] === option.text ? "1px" : "",
                        borderStyle: "solid",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {option.icon && <option.icon size={32} />}
                        <Text
                          size="sm"
                          ta="center"
                          style={{ marginTop: "10px" }}
                        >
                          {option.text}
                        </Text>
                      </Box>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
              <div
                style={{
                  marginTop: "30px",
                  alignContent: "center",
                }}
              >
                {activeStep > 0 && (
                  <Button
                    variant="default"
                    onClick={prevStep}
                    style={{ marginRight: "10px" }}
                  >
                    Back
                  </Button>
                )}
                {activeStep < questions.length - 1 && (
                  <Button
                    style={{
                      alignSelf: "end",
                    }}
                    onClick={nextStep}
                    disabled={!answers[activeStep]}
                  >
                    Next
                  </Button>
                )}
                {activeStep === questions.length - 1 && (
                  <Button
                    onClick={handleQuizCompletion}
                    disabled={!answers[activeStep]}
                  >
                    Finish Quiz
                  </Button>
                )}
              </div>
            </div>
          </Stepper.Step>
        ))}
      </Stepper>
    </Container>
  );
};

export default Quiz;
