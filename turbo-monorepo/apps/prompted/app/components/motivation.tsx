import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Stack,
  Center,
} from "@mantine/core";
import LevelProgressAnimation from "../process/[id]/components/level-animation";
import MilestoneProgressAnimation from "../process/[id]/components/milestone-animation";

const featureDescriptions = {
  A: {
    title: "Track Your Progress",
    description:
      "Dive into visual charts that showcase your writing journey. Monitor your growth, spot trends, and use insights to stay motivated and reach new milestones.",
    mainContent: (
      <div style={{ width: "100%", height: "auto" }}>
        Image here for Stat Charts
      </div>
    ),
    thumbnail: (
      <div style={{ height: "100px", backgroundColor: "#e0e0e0" }}>
        Thumbnail for Stat Charts
      </div>
    ),
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
    thumbnail: (
      <div style={{ height: "100px", backgroundColor: "#e0e0e0" }}>
        Thumbnail for Level Badges
      </div>
    ),
  },
  C: {
    title: "Achieve Milestone Badges",
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
    thumbnail: (
      <div style={{ height: "100px", backgroundColor: "#e0e0e0" }}>
        Thumbnail for Milestone Badges
      </div>
    ),
  },
  D: {
    title: "Browse Your Entries",
    description:
      "Easily explore your past entries with powerful search and sorting options. Revisit your favorite pieces or find inspiration in previous works.",
    mainContent: (
      <div style={{ width: "100%", height: "auto" }}>
        Image here for Search and Sort Entries
      </div>
    ),
    thumbnail: (
      <div style={{ height: "100px", backgroundColor: "#e0e0e0" }}>
        Thumbnail for Search and Sort Entries
      </div>
    ),
  },
};

const FeatureHighlight: React.FC<{ answerQ4: string }> = ({ answerQ4 }) => {
  const featureKeys = Object.keys(featureDescriptions);
  const initialOrder = featureKeys.includes(answerQ4)
    ? [answerQ4, ...featureKeys.filter((key) => key !== answerQ4)]
    : featureKeys;
  const [orderedFeatures, setOrderedFeatures] =
    useState<string[]>(initialOrder);

  const selectedFeature = orderedFeatures[0];
  const mainFeature = featureDescriptions[selectedFeature];

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
  return (
    <Container size="xl">
      <Title ta="center" order={1} mb="xl">
        Reward yourself for writing...
      </Title>
      <Grid gutter={30}>
        {/* Left Column: Main and Secondary Features */}
        <Grid.Col span={8}>
          <Stack gap="lg">
            {/* Main Feature */}
            <Card shadow="sm" padding="lg">
              <Center>{mainFeature.mainContent}</Center>
            </Card>

            {/* Secondary Features */}
            <Grid gutter={20} align="center">
              {orderedFeatures.slice(1).map((key) => (
                <Grid.Col span={4} key={key}>
                  <Card
                    shadow="sm"
                    padding="md"
                    style={{ textAlign: "center", cursor: "pointer" }}
                    onClick={() => rotateFeatures(key)}
                  >
                    <Stack align="center" gap="sm">
                      {featureDescriptions[key].thumbnail}
                      <Title order={5}>{featureDescriptions[key].title}</Title>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>

        {/* Right Column: Feature Description */}
        <Grid.Col span={4}>
          <Stack gap="sm">
            <Title order={3}>{mainFeature.title}</Title>
            <Text c="dimmed">{mainFeature.description}</Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default FeatureHighlight;
