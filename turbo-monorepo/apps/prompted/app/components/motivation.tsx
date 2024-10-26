import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Stack,
  Center,
  Group,
} from "@mantine/core";
import LevelProgressAnimation from "../process/[id]/components/level-animation";
import MilestoneProgressAnimation from "../process/[id]/components/milestone-animation";
import { FaBarsProgress } from "react-icons/fa6";
import { FaIdBadge, FaMedal, FaSearch } from "react-icons/fa";

export const featureDescriptions = {
  A: {
    title: "Track Your Progress",
    description:
      "Dive into visual charts that showcase your writing journey. Monitor your growth, spot trends, and use insights to stay motivated and reach new milestones.",
    mainContent: (
      <div style={{ width: "100%", height: "auto" }}>
        Image here for Stat Charts
      </div>
    ),
    icon: <FaBarsProgress size={40} />,
  },
  B: {
    title: "Earn Level Badges",
    description:
      "Level up with badges that recognize your consistent efforts. Keep pushing forward, and unlock new rewards as you hit each target along the way.",
    mainContent: (
      <LevelProgressAnimation
        levelInfo={{
          startLevel: 1,
          endLevel: 2,
          startLowValue: 0,
          startHighValue: 100,
          endLowValue: 100,
          endHighValue: 250,
          startProgressValue: 40,
          endProgressValue: 130,
        }}
        title={"Word Mania"}
        description={"Most number of words in a single prompt"}
        icon={"LuWholeWord"}
        label={"total words"}
        animated={true}
      />
    ),
    icon: <FaIdBadge size={40} />,
  },
  C: {
    title: "Achieve Milestones",
    description:
      "Celebrate one-time achievements with milestone badges. These are unique rewards to mark special moments in your writing journey that you can proudly show off.",
    mainContent: (
      <Card
        withBorder
        key={"badgeId"}
        style={{
          minWidth: "14rem",
          minHeight: "15rem",
          margin: "0 auto",
          alignContent: "center",
        }}
      >
        <Text ta="center" size="xl">
          Milestone Reached!
        </Text>

        <MilestoneProgressAnimation
          title="First Entry"
          description="Submitted the first entry"
          icon="MdOutlineCelebration"
          animated={true}
        />
      </Card>
    ),
    icon: <FaMedal size={40} />,
  },
  D: {
    title: "Browse Past Entries",
    description:
      "Easily explore your past entries with powerful search and sorting options. Revisit your favorite pieces or find inspiration in previous works.",
    mainContent: (
      <div style={{ width: "100%", height: "auto" }}>
        Image here for Search and Sort Entries
      </div>
    ),
    icon: <FaSearch size={40} />,
  },
};

const FeatureHighlight: React.FC<{ answerQ4: string }> = ({ answerQ4 }) => {
  const featureKeys = Object.keys(featureDescriptions);
  const initialOrder = featureKeys.includes(answerQ4)
    ? [answerQ4, ...featureKeys.filter((key) => key !== answerQ4)]
    : featureKeys;
  const [orderedFeatures, setOrderedFeatures] =
    useState<string[]>(initialOrder);

  useEffect(() => {
    setOrderedFeatures(initialOrder);
  }, [answerQ4]);

  const rotateFeatures = (clickedKey: string) => {
    const clickedIndex = orderedFeatures.indexOf(clickedKey);
    if (clickedIndex > -1) {
      // Rotate the array to bring the clicked element to the front
      const newOrder = [
        ...orderedFeatures.slice(clickedIndex),
        ...orderedFeatures.slice(0, clickedIndex),
      ];
      setOrderedFeatures(newOrder);
    }
  };

  if (orderedFeatures.length === 0) {
    return null; // or a loading spinner
  }

  return (
    <Container size="xl" p="xl">
      <Grid gutter={30}>
        {/* Left Column: Main and Secondary Features */}
        <Grid.Col span={8}>
          <Stack gap="lg">
            {/* Main Feature */}
            <Card withBorder padding="lg">
              <Center>
                {featureDescriptions[orderedFeatures[0]].mainContent}
              </Center>
            </Card>

            {/* Secondary Features */}
            <Grid gutter={20} align="center">
              {orderedFeatures.slice(1).map((key) => (
                <Grid.Col span={4} key={key}>
                  <Card
                    withBorder
                    padding="md"
                    style={{ textAlign: "center", cursor: "pointer" }}
                    onClick={() => rotateFeatures(key)}
                  >
                    <Stack align="center" gap="sm">
                      {featureDescriptions[key].icon}
                      <Title order={5}>{featureDescriptions[key].title}</Title>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>

        <Grid.Col span={4}>
          <Stack gap="sm" pt={"xl"}>
            <Group w="full" align="center" gap="sm">
              {featureDescriptions[orderedFeatures[0]].icon}
              <Title order={2} w="full">
                {featureDescriptions[orderedFeatures[0]].title}
              </Title>
            </Group>
            <Text c="dimmed">
              {featureDescriptions[orderedFeatures[0]].description}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default FeatureHighlight;
