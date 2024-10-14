"use client";
import { Grid, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import {
  FaUser,
  FaPercentage,
  FaFileAlt,
  FaFileWord,
  FaFont,
  FaRobot,
  FaClock,
} from "react-icons/fa";
import { getPercentageColor } from "../../actions";

const icons = {
  totalCharacters: FaFont,
  aiCharacters: FaRobot,
  userCharacters: FaUser,
  userPercentage: FaPercentage,
  uniqueWordCount: FaFileWord,
  uniqueWordPercentage: FaPercentage,
  totalWords: FaFileAlt,
  elapsedTime: FaClock,
};

export type StatsProps = {
  totalCharacters: number;
  aiCharacters: number;
  userCharacters: number;
  userPercentage: number;
  uniqueWordCount: number;
  uniqueWordPercentage: number;
  totalWords: number;
  elapsedTime: number;
  aiCallCount: number;
};

const data = (stats: StatsProps) =>
  [
    {
      title: "Total Characters",
      icon: "totalCharacters",
      value: stats.totalCharacters.toString(),
    },
    {
      title: "AI Characters",
      icon: "aiCharacters",
      value: stats.aiCharacters.toString(),
      color: "grape",
    },
    {
      title: "User Characters",
      icon: "userCharacters",
      value: stats.userCharacters.toString(),
    },
    {
      title: "User Percentage",
      icon: "userPercentage",
      value: `${stats.userPercentage}%`,
      color: getPercentageColor(stats.userPercentage),
    },
    {
      title: "Total Words",
      icon: "totalWords",
      value: stats.totalWords.toString(),
    },
    {
      title: "Unique Word Count",
      icon: "uniqueWordCount",
      value: stats.uniqueWordCount.toString(),
    },
    {
      title: "Uniqueness Percentage",
      icon: "uniqueWordPercentage",
      value: `${stats.uniqueWordPercentage.toFixed(2)}%`,
      color: getPercentageColor(stats.uniqueWordPercentage),
    },
  ] as const;

export function StatsGrid3({ stats }: { stats: StatsProps }) {
  const statsData = data(stats);
  const theme = useMantineTheme();

  return (
    <Grid mt="sm">
      {statsData.map((stat, index) => {
        const Icon = icons[stat.icon];
        const span = index < 4 ? 3 : 4; // 4 cards on top row, 3 on bottom

        return (
          <Grid.Col key={stat.title} span={span}>
            <Paper
              withBorder
              p="sm"
              radius="md"
              shadow="xs"
              style={{
                transition: "box-shadow 150ms ease, transform 100ms ease",
                boxShadow: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = theme.shadows.md;
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {stat.title}
                </Text>
                <Icon size="1rem" />
              </Group>

              <Group align="flex-end" mt={10}>
                <Text
                  size="lg"
                  c={
                    stat.title === "Uniqueness Percentage" ||
                    stat.title === "User Percentage" ||
                    stat.title === "AI Characters"
                      ? stat.color
                      : undefined
                  }
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  {stat.value}
                </Text>
              </Group>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
