"use client";
import {
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import React, {
  createElement,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaIdBadge, FaMedal, FaSearch } from "react-icons/fa";
import { FaBarsProgress } from "react-icons/fa6";
import LevelProgressAnimation from "../process/[id]/components/level-animation";
import MilestoneProgressAnimation from "../process/[id]/components/milestone-animation";

const ShowStats = lazy(() => import("./showStats"));

export const featureDescriptions = {
  A: {
    title: "Track Your Progress",
    description:
      "Dive into visual charts that showcase your writing journey. Monitor your growth, spot trends, and use insights to stay motivated and reach new milestones.",
    mainContent: <ShowStats isStats={true} />,
    icon: FaBarsProgress,
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
    icon: FaIdBadge,
  },
  C: {
    title: "Achieve Milestones",
    description:
      "Celebrate one-time achievements with milestone badges. These are unique rewards to mark special moments in your writing journey that you can proudly show off.",
    mainContent: (
      <Card
        withBorder
        key={"badgeId"}
        radius={"md"}
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
    icon: FaMedal,
  },
  D: {
    title: "Browse Past Entries",
    description:
      "Easily explore your past entries with powerful search and sorting options. Revisit your favorite pieces or find inspiration in previous works.",
    mainContent: <ShowStats isStats={false} />,
    icon: FaSearch,
  },
};

interface FeatureHighlightProps {
  answerQ4?: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({ answerQ4 }) => {
  const theme = useMantineTheme();
  const [selectedFeature, setSelectedFeature] = useState(answerQ4 || "A");
  // eslint-disable-next-line no-undef
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const rotateFeatures = (clickedKey: string) => {
    setSelectedFeature(clickedKey);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setSelectedFeature((prev) => {
        const featureKeys = Object.keys(featureDescriptions);
        const currentIndex = featureKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % featureKeys.length;
        return featureKeys[nextIndex];
      });
    }, 8000); // Rotate every 8 seconds
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Container size="xl">
      <Group>
        <Divider flex={1} />
        <Title ta="center" order={1}>
          Keep the Momentum Going
        </Title>
        <Divider flex={1} />
      </Group>

      <Text ta="center" c="dimmed" mb="xl">
        Discover more ways to stay motivated and inspired
      </Text>
      <Grid gutter={30}>
        {/* Left Column: Main and Secondary Features */}
        <Grid.Col span={8}>
          <Stack gap="lg">
            {/* Main Feature */}
            <Card
              padding="lg"
              style={{ height: "18rem", backgroundColor: "transparent" }}
            >
              <Center style={{ height: "100%" }}>
                <Suspense fallback={<div>Loading...</div>}>
                  {featureDescriptions[selectedFeature].mainContent}
                </Suspense>
              </Center>
            </Card>

            {/* Secondary Features */}
            <Grid gutter={20} align="center">
              {Object.entries(featureDescriptions).map(([key, feature]) => (
                <Grid.Col span={{ base: 6, md: 3 }} key={key}>
                  <Card
                    withBorder
                    padding="md"
                    h={100}
                    onClick={() => rotateFeatures(key)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = theme.shadows.md;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor:
                        selectedFeature === key
                          ? "var(--mantine-color-blue-light-hover)"
                          : "",
                      borderColor:
                        selectedFeature === key
                          ? "var(--mantine-color-blue-light-color)"
                          : "",
                      borderWidth: selectedFeature === key ? "1px" : "",
                      borderStyle: "solid",
                    }}
                  >
                    <Stack justify="end" align="center" h={"100%"} gap="sm">
                      {feature?.icon &&
                        createElement(feature.icon, { size: 20 })}
                      <Text size="sm">{feature.title}</Text>
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
              {featureDescriptions[selectedFeature]?.icon &&
                createElement(featureDescriptions[selectedFeature].icon, {
                  size: 20,
                })}
              <Title order={2} w="full">
                {featureDescriptions[selectedFeature].title}
              </Title>
            </Group>
            <Text c="dimmed">
              {featureDescriptions[selectedFeature].description}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default FeatureHighlight;
