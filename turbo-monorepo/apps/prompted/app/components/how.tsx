import {
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Stepper,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
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
    const stepDuration = 26000; // Increased to 26 seconds for each step
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

  const handleStepClick = (step: number) => {
    setActiveStep(step);
    setProgress(0); // Reset progress when manually changing steps
  };

  const getStepIcon = (step: number) => {
    if (step <= activeStep) {
      return (
        <Center>
          <FaStar />
        </Center>
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
        return null;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return {
          title: "Choose a Prompt",
          description:
            "Begin by selecting a prompt that sparks your interest. Generate a random prompt, browse categories, or search through the list to find your match.",
          gifSrc:
            colorScheme === "dark"
              ? "/images/ChoosePromptDark.gif"
              : "/images/ChoosePromptLight.gif",
        };
      case 1:
        return {
          title: "Start Writing",
          description:
            "Dive into the writing experience with a simple text editor. Focus on your ideas and let your thoughts flow naturally, while tracking progress with helpful stats.",
          gifSrc:
            colorScheme === "dark"
              ? "/images/WritePageDark.gif"
              : "/images/WritePageLight.gif",
        };
      case 2:
        return {
          title: "Use AI Assistance",
          description:
            "If you get stuck, AI can help generate the next sentence. Use it to overcome writer’s block and keep your story moving forward.",
          gifSrc:
            colorScheme === "dark"
              ? "/images/AIAssistDark.gif"
              : "/images/AIAssistLight.gif",
        };
      case 3:
        return {
          title: "Review and Analyze",
          description:
            "After submitting, explore detailed insights, including writing time, unique word percentage, and word frequency in a bubble chart.",
          gifSrc:
            colorScheme === "dark"
              ? "/images/ReviewAnalyzeDark.gif"
              : "/images/ReviewAnalyzeLight.gif",
        };
      default:
        return null;
    }
  };

  const stepContent = getStepContent(activeStep);

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
          <div>
            <Title order={3}>{stepContent.title}</Title>
            <Text mb="sm" c="dimmed">
              {stepContent.description}
            </Text>
            <Card p="0" m="0" bg={"transparent"}>
              <Image
                src={stepContent.gifSrc}
                alt={stepContent.title}
                width={600}
                height={300}
                layout="responsive"
                unoptimized
                style={{
                  transform: "scale(1.1)",
                }}
              />
            </Card>
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
