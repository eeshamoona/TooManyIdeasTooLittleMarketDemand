import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { FaUserPlus, FaPercentage, FaReceipt, FaCoins } from "react-icons/fa";

const icons = {
  user: FaUserPlus,
  percentage: FaPercentage,
  receipt: FaReceipt,
  coin: FaCoins,
};

type StatsProps = {
  totalCharacters: number;
  aiCharacters: number;
  userCharacters: number;
  userPercentage: number;
};

const getUserPercentageColor = (percentage: number) => {
  if (percentage < 33) return "red";
  if (percentage < 66) return "yellow";
  return "green";
};

const data = (stats: StatsProps) =>
  [
    {
      title: "Total Characters",
      icon: "receipt",
      value: stats.totalCharacters.toString(),
    },
    {
      title: "AI Characters",
      icon: "coin",
      value: stats.aiCharacters.toString(),
    },
    {
      title: "User Characters",
      icon: "user",
      value: stats.userCharacters.toString(),
    },
    {
      title: "User Percentage",
      icon: "percentage",
      value: `${stats.userPercentage}%`,
      color: getUserPercentageColor(stats.userPercentage),
    },
  ] as const;

export function StatsGrid({ stats }: { stats: StatsProps }) {
  const statsData = data(stats).map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {stat.title}
          </Text>
          <Icon size="1rem" />
        </Group>

        <Group align="flex-end" mt={25}>
          <Text
            size="xl"
            c={stat.title === "User Percentage" ? stat.color : undefined}
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {stat.value}
          </Text>
          <Text size="sm"></Text>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{statsData}</SimpleGrid>;
}
