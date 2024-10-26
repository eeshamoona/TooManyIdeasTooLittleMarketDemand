"use client";
import {
  Button,
  Container,
  Group,
  Text,
  Title,
  Divider,
  Box,
  Stack,
  ThemeIcon,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { FaPenFancy, FaLightbulb, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdOutlineQuiz } from "react-icons/md";

const LandingPage = () => {
  const router = useRouter();
  const getStarted = () => {
    router.push("/write");
  };

  const customizeLandingPage = () => {
    localStorage.removeItem("quizAnswers");
    router.refresh();
  };

  return (
    <Container size="lg" py={60}>
      {/* Hero Section */}

      <Group justify="end">
        <Tooltip label="Customize Landing Page" position="left" withArrow>
          <ActionIcon
            variant="subtle"
            color="blue"
            radius="sm"
            size="lg"
            onClick={customizeLandingPage}
          >
            <MdOutlineQuiz />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Box style={{ textAlign: "center", padding: "40px 20px" }}>
        <Title order={1} mb={20}>
          Unleash Your Creativity, One Prompt at a Time
        </Title>
        <Text size="lg" mb={20}>
          Dive into random prompts designed to push your creativity beyond its
          limits. Write outside your comfort zone, guided by AI when needed.
        </Text>
        <Group justify="center">
          <Button onClick={getStarted} size="xl">
            Start Your Creative Journey
          </Button>
        </Group>
      </Box>

      <Divider my={40} />

      {/* Why Prompted Section */}
      <Box py={40} px={20} style={{ textAlign: "center" }}>
        <Title order={2} mb={20}>
          Why Prompted?
        </Title>
        <Stack align="stretch" justify="center">
          <Group align="center">
            <ThemeIcon radius="xl" size="xl">
              <FaPenFancy size={32} />
            </ThemeIcon>
            <Text size="lg">
              Step outside your comfort zone with random prompts that challenge
              you to explore new ideas, genres, and perspectives.
            </Text>
          </Group>

          <Group align="center">
            <ThemeIcon radius="xl" size="xl">
              <FaLightbulb size={32} />
            </ThemeIcon>
            <Text size="lg">
              Stuck? Our AI offers helpful nudges to keep you moving forward
              without taking over your creative flow.
            </Text>
          </Group>

          <Group align="center">
            <ThemeIcon radius="xl" size="xl">
              <FaStar size={32} />
            </ThemeIcon>
            <Text size="lg">
              Track your progress with badges and streaks as you complete each
              writing challenge.
            </Text>
          </Group>
        </Stack>
      </Box>

      <Divider my={40} />

      {/* How It Works Section */}
      <Box py={40} style={{ textAlign: "center" }}>
        <Title order={2} mb={20}>
          How It Works
        </Title>
        <Stack>
          <Text size="lg">
            1. Get a Random Prompt: Instantly receive a new creative challenge.
          </Text>
          <Text size="lg">
            2. Write, Guided by AI: Keep the words flowing with AI support when
            you need it.
          </Text>
          <Text size="lg">
            3. Track Your Progress: Earn badges and keep your streak going as
            you complete challenges.
          </Text>
        </Stack>
      </Box>

      <Divider my={40} />

      {/* Final Call-to-Action */}
      <Box py={40} style={{ textAlign: "center" }}>
        <Title order={2} mb={20}>
          Stop Waiting. Start Creating.
        </Title>
        <Text size="lg" mb={20}>
          Don’t wait for the perfect story to come to you—challenge yourself
          with Prompted today.
        </Text>
        <Group justify="center">
          <Button onClick={getStarted} size="xl">
            Get Started Now
          </Button>
        </Group>
      </Box>

      <Divider my={40} />

      {/* Footer */}
      <Box py={20} style={{ textAlign: "center" }}>
        <Text size="sm" c="dimmed">
          &copy; {new Date().getFullYear()} Prompted. All rights reserved.
        </Text>
        <Group mt={10} justify="center">
          <Text component="a" href="#">
            Facebook
          </Text>
          <Text component="a" href="#">
            Twitter
          </Text>
          <Text component="a" href="#">
            Instagram
          </Text>
          <Text component="a" href="#">
            Contact Us
          </Text>
        </Group>
      </Box>
    </Container>
  );
};

export default LandingPage;
