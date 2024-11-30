"use client";
import { Grid, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import {
  FaBalanceScale,
  FaChartPie,
  FaClock,
  FaFingerprint,
  FaFont,
  FaPercentage,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import { getPercentageColor } from "../../actions";

const icons = {
  totalCharacters: FaFont,
  aiCharacters: FaRobot,
  userCharacters: FaUser,
  userPercentage: FaChartPie,
  uniqueWordCount: FaFingerprint,
  uniqueWordPercentage: FaBalanceScale,
  totalWords: FaFont,
  elapsedTime: FaClock,
  percentage: FaPercentage,
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
  aiWordCount: number;
  targetWordCount: number;
};

const data = (stats: StatsProps) =>
  [
    {
      title: "Total Words",
      icon: "totalWords",
      value: `${stats.totalWords} / ${stats.targetWordCount} words`,
      color:
        stats.totalWords < stats.targetWordCount * 0.8
          ? "red"
          : stats.totalWords < stats.targetWordCount
            ? "yellow"
            : "green",
      description:
        stats.totalWords < stats.targetWordCount
          ? `${stats.targetWordCount - stats.totalWords} words below target`
          : `${stats.totalWords - stats.targetWordCount} words over target 🎉`,
    },
    {
      title: "Writing Variety",
      icon: "uniqueWordPercentage",
      value: `${stats.uniqueWordPercentage.toFixed(2)}% unique`,
      color: getPercentageColor(stats.uniqueWordPercentage),
      description: `${stats.uniqueWordCount} different words used`,
    },
    {
      title: "Writing Originality",
      icon: "userPercentage",
      value: `${stats.userPercentage}% original`,
      color: getPercentageColor(stats.userPercentage),
      description: `${stats.aiWordCount} words written by AI`,
    },
  ] as const;

export function StatsGrid3({ stats }: { stats: StatsProps }) {
  const statsData = data(stats);
  const theme = useMantineTheme();

  return (
    <Grid mt="sm">
      {statsData.map((stat, index) => {
        const Icon = icons[stat.icon];
        const span = index < 6 ? 4 : 6;

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

              <Group align="flex-end" mt={25}>
                <Text
                  size="xl"
                  c={stat.color || undefined}
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                  {stat.value}
                </Text>
              </Group>

              {stat.description && (
                <Text size="xs" c="dimmed" mt={5}>
                  {stat.description}
                </Text>
              )}
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
