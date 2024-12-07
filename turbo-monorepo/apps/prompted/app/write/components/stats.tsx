import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import {
  FaCoins,
  FaFont,
  FaPercentage,
  FaReceipt,
  FaUserPlus,
} from "react-icons/fa";
import { getPercentageColor } from "../../read/actions";

const icons = {
  user: FaUserPlus,
  percentage: FaPercentage,
  receipt: FaReceipt,
  coin: FaCoins,
  font: FaFont,
};

type StatsProps = {
  totalCharacters: number;
  aiCharacters: number;
  userCharacters: number;
  userPercentage: number;     
  totalWords: number;
  targetWordCount: number | null;
  aiWordCount: number;
};

const data = (stats: StatsProps) =>
  [
    {
      title: "Word Count",
      icon: "font",
      value: stats.targetWordCount
        ? `${stats.totalWords} / ${stats.targetWordCount}`
        : `${stats.totalWords}`,
      color: stats.targetWordCount
        ? stats.totalWords < stats.targetWordCount * 0.8
          ? "red"
          : stats.totalWords < stats.targetWordCount
            ? "yellow"
            : "green"
        : undefined,
    },
    {
      title: "User Percentage",
      icon: "percentage",
      value: `${stats.userPercentage}%`,
      color: getPercentageColor(stats.userPercentage),
      aiWordCount: stats.aiWordCount,
    },
  ] as const;

export function StatsGrid({ stats }: { stats: StatsProps }) {
  const statsData = data(stats).map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper withBorder p="md" radius="md" key={stat.title} style={{ flex: 1 }}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {stat.title}
          </Text>
          <Icon size="1rem" />
        </Group>

        <Group align="flex-end" mt={25}>
          <Text
            size="xl"
            c={stat.color || ""}
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {stat.value}
          </Text>
          <Text size="sm"></Text>
        </Group>

        {stat.title === "Word Count" && (
          <Text size="xs" c="dimmed" mt={5}>
            {stats.targetWordCount
              ? stats.totalWords < stats.targetWordCount
                ? `${stats.targetWordCount - stats.totalWords} words to go`
                : `${stats.totalWords - stats.targetWordCount} words over target 🎉`
              : `Keep writing!`}
          </Text>
        )}

        {stat.title === "User Percentage" && (
          <Text size="xs" c="dimmed" mt={5}>
            {stats.aiWordCount} words written by AI
          </Text>
        )}
      </Paper>
    );
  });

  return (
    <SimpleGrid cols={2} spacing="md">
      {statsData}
    </SimpleGrid>
  );
}
