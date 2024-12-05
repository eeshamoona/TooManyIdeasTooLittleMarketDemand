import {
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  RingProgress,
  Stepper,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheck, FaStar } from "react-icons/fa";
import {
  PiNumberFourBold,
  PiNumberOneBold,
  PiNumberThreeBold,
  PiNumberTwoBold,
} from "react-icons/pi";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 1000px)");
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const stepDuration = 20000; // 20 seconds for each step
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % 4);
      setProgress(0); // Reset progress when changing step automatically
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, stepDuration / 100); // Increment progress by 1% every 100 ms

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [activeStep]);

  // Reset progress when the active step is manually changed
  useEffect(() => {
    setProgress(0);
  }, [activeStep]);

  const getStepIcon = (step: number) => {
    if (step <= activeStep) {
      return (
        <RingProgress
          size={38}
          thickness={2}
          roundCaps
          sections={[{ value: progress, color: "blue" }]}
          label={
            <Center>
              <FaStar />
            </Center>
          }
        />
      );
    }
    switch (step) {
      case 0:
        return <PiNumberOneBold size={16} />;
      case 1:
        return <PiNumberTwoBold size={16} />;
      case 2:
        return <PiNumberThreeBold size={16} />;
      case 3:
        return <PiNumberFourBold size={16} />;
      default:
        return <FaCheck size={16} />;
    }
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
    setProgress(0); // Reset progress when manually changing steps
  };

  return (
    <Container size="lg" content="center">
      <Group>
        <Divider flex={1} />
        <Title ta="center" order={1}>
          How To Start Writing
        </Title>
        <Divider flex={1} />
      </Group>

      <Text ta="center" c="dimmed" mb="md">
        Start with ease, find inspiration fast, and let your creativity flow
        freely
      </Text>

      <Grid gutter={50} align="flex-start" pt="xl">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stepper
            active={activeStep}
            onStepClick={handleStepClick}
            orientation={isSmallScreen ? "horizontal" : "vertical"}
            iconSize={32}
          >
            <Stepper.Step
              label="Choose a Prompt"
              description="Find your inspiration"
              icon={getStepIcon(0)}
            />
            <Stepper.Step
              label="Start Writing"
              description="Let your creativity flow"
              icon={getStepIcon(1)}
            />
            <Stepper.Step
              label="Use AI Assistance"
              description="Overcome writer's block"
              icon={getStepIcon(2)}
            />
            <Stepper.Step
              label="Review and Analyze"
              description="Get insights on your writing"
              icon={getStepIcon(3)}
            />
          </Stepper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid gutter={30}>
            <Grid.Col span={12}>
              {activeStep === 0 && (
                <div>
                  <Title order={3}>Choose a Prompt</Title>
                  <Text mb="sm" c="dimmed">
                    Begin by selecting a prompt that sparks your interest. You
                    can generate a random prompt, browse categories tailored to
                    your mood, or search through the list to find the perfect
                    match. There’s always something to ignite your creativity.
                  </Text>
                  <Card withBorder p="0" m="sm" bg={"transparent"}>
                    <Image
                      src={
                        colorScheme === "dark"
                          ? "/images/ChoosePromptDark.gif"
                          : "/images/ChoosePromptLight.gif"
                      }
                      alt="Choose Prompt"
                      width={800}
                      height={600}
                      style={{ objectFit: "contain" }}
                    />
                  </Card>
                </div>
              )}

              {activeStep === 1 && (
                <div>
                  <Title order={3}>Start Writing</Title>
                  <Text mb="sm" c="dimmed">
                    Dive into the writing experience with a simple text editor.
                    Focus on your ideas and let your thoughts flow naturally. As
                    you write, you'll see helpful statistics at the bottom of
                    the page, giving you a sense of progress.
                  </Text>
                  <Card withBorder p="0" m="sm" bg={"transparent"}>
                    <Image
                      src={
                        colorScheme === "dark"
                          ? "/images/WriteDark.png"
                          : "/images/WriteLight.png"
                      }
                      alt="Choose Prompt"
                      width={800}
                      height={600}
                      style={{ objectFit: "contain" }}
                    />
                  </Card>
                </div>
              )}

              {activeStep === 2 && (
                <div>
                  <Title order={3}>Use AI Assistance</Title>
                  <Text mb="sm" c="dimmed">
                    If you get stuck, AI can help generate the next sentence.
                    Once you've written at least 100 characters, use AI to
                    overcome writer’s block and keep your story moving forward.
                    See which parts are AI-generated by hovering over the
                    lightbulb icon.
                  </Text>
                  <Card withBorder p="0" m="sm" bg={"transparent"}>
                    <Image
                      src={
                        colorScheme === "dark"
                          ? "/images/AIAssistDark.gif"
                          : "/images/AIAssistLight.gif"
                      }
                      alt="Choose Prompt"
                      unoptimized
                      width={800}
                      height={600}
                      style={{ objectFit: "contain" }}
                    />
                  </Card>
                </div>
              )}

              {activeStep === 3 && (
                <div>
                  <Title order={3}>Review and Analyze</Title>
                  <Text mb="sm" c="dimmed">
                    When you submit your writing, you'll receive detailed
                    insights, including writing time, unique word percentage,
                    and other metrics. AI feedback covers five categories: mood,
                    relevance, creativity, completeness, and readability.
                    Explore your word frequency in a word bubble chart to see
                    the most commonly used words in your writing.
                  </Text>
                  <Card withBorder p="0" m="sm" bg="transparent">
                    <Image
                      src={
                        colorScheme === "dark"
                          ? "/images/ResultsDark.gif"
                          : "/images/ResultsLight.gif"
                      }
                      alt="Choose Prompt"
                      unoptimized
                      width={800}
                      height={600}
                      style={{ objectFit: "contain" }}
                    />
                  </Card>
                </div>
              )}
            </Grid.Col>

            {/* Placeholder for an image */}
            <Grid.Col span={12}>
              <div style={{ textAlign: "center" }}></div>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
