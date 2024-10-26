import { useState } from "react";
import { Tabs, Text, Grid, Container, Title, Stack } from "@mantine/core";
import { FaFeather, FaLightbulb, FaRobot, FaChartLine } from "react-icons/fa";
import { TypewriterArray } from "./typewriter";

const prompts = [
  "Imagine your dream vacation.",
  "What if you could fly?",
  "Describe your perfect day.",
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState("pick-a-prompt");

  return (
    <Container size="lg" content="center" style={{ marginTop: "40px" }}>
      <Stack
        gap="sm"
        mb="8rem"
        align="center"
        style={{
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <Title ta="center">Get inspired with questions like...</Title>
        <TypewriterArray strings={prompts} />
      </Stack>
      <Tabs
        orientation="horizontal"
        variant="pills"
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List grow>
          <Tabs.Tab value="pick-a-prompt" leftSection={<FaFeather size={16} />}>
            Pick a Prompt
          </Tabs.Tab>
          <Tabs.Tab
            value="start-writing"
            leftSection={<FaLightbulb size={16} />}
          >
            Start Writing
          </Tabs.Tab>
          <Tabs.Tab value="get-assistance" leftSection={<FaRobot size={16} />}>
            Get AI Assistance
          </Tabs.Tab>
          <Tabs.Tab value="see-stats" leftSection={<FaChartLine size={16} />}>
            See Your Progress
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pick-a-prompt" pl="md">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={3}>Pick a Prompt</Title>
              <Text mt="md" c="dimmed">
                Get started by picking a prompt that fits your vibe. With a wide
                range of creative questions, you'll always find a spark to fuel
                your ideas.
              </Text>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="start-writing" pl="md">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={3}>Start Writing</Title>
              <Text mt="md" c="dimmed">
                Just you, your thoughts, and a blank page. Dive into an
                intuitive editor that makes writing feel effortless—let your
                words flow without distractions.
              </Text>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="get-assistance" pl="md">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={3}>Get AI Assistance</Title>
              <Text mt="md" color="dimmed">
                Need a spark to keep going? Our AI is ready to lend a hand with
                next-line suggestions, helping you overcome writer’s block and
                stay inspired.
              </Text>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="see-stats" pl="md">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={3}>See Your Progress</Title>
              <Text mt="md" c="dimmed">
                Watch your growth unfold! Track your unique word count, see your
                writing stats, and enjoy milestones that keep you motivated to
                keep creating.
              </Text>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
