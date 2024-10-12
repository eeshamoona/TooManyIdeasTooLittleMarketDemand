import { Paper, SimpleGrid, Text, useMantineTheme } from "@mantine/core";
import { FaUserPlus, FaPercentage, FaReceipt, FaCoins } from "react-icons/fa";
import { useHover } from "@mantine/hooks";

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
      hoverText: "Total number of characters",
    },
    {
      title: "AI Characters",
      icon: "coin",
      value: stats.aiCharacters.toString(),
      hoverText: "Number of AI-generated characters",
    },
    {
      title: "User Characters",
      icon: "user",
      value: stats.userCharacters.toString(),
      hoverText: "Number of user-generated characters",
    },
    {
      title: "User Percentage",
      icon: "percentage",
      value: `${stats.userPercentage}%`,
      color: getUserPercentageColor(stats.userPercentage),
      hoverText: "Percentage of user-generated characters",
    },
  ] as const;

export function StatsGrid({ stats }: { stats: StatsProps }) {
  const theme = useMantineTheme();

  const statsData = data(stats).map((stat) => {
    const Icon = icons[stat.icon];
    const { hovered, ref } = useHover();

    return (
      <Paper
        ref={ref}
        withBorder
        p="xs"
        radius="md"
        key={stat.title}
        shadow="none"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
          borderRadius: theme.radius.md,
        }}
      >
        <Icon size="1rem" style={{ alignSelf: "flex-start" }} />

        <Text
          size="sm"
          c={
            !hovered
              ? "dimmed"
              : stat.title === "User Percentage"
                ? stat.color
                : undefined
          }
          style={{ alignSelf: "flex-end" }}
        >
          {hovered ? stat.value : stat.title}
        </Text>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{statsData}</SimpleGrid>;
}
