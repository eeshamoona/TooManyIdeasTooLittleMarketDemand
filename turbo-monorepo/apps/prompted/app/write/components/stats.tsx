import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { FaCoins, FaPercentage, FaReceipt, FaUserPlus } from "react-icons/fa";
import { getPercentageColor } from "../../read/actions";

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
      color: "grape",
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
      color: getPercentageColor(stats.userPercentage),
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
            c={
              stat.title === "User Percentage" || stat.title === "AI Characters"
                ? stat.color
                : undefined
            }
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
