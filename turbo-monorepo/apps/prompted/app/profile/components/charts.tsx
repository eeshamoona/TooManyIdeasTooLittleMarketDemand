"use client";
import React from "react";
import {
  Group,
  Paper,
  useMantineColorScheme,
  Text,
  Grid,
  Card,
  Stack,
  Title,
  Button,
  ThemeIcon,
  Center,
  Loader,
} from "@mantine/core";
import { CompositeChart, DonutChart, RadarChart } from "@mantine/charts";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import Heatmap from "../../progress/components/heatmap";
import { useRouter } from "next/navigation";
import { profileQuizQuestions } from "../../profile-quiz/constants";
import { FaBook } from "react-icons/fa";

interface StatChartsProps {
  entries: any[];
  profile: any;
  username: string;
  email: string;
}

const StatCharts: React.FC<StatChartsProps> = ({
  entries,
  profile,
  username,
  email,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();

  const findOptionDetails = (questionKey: string, value: string) => {
    const question = profileQuizQuestions.find((q) => q.question === questionKey);
    const option = question?.options.find((opt) => opt.value === value);
    return {
      label: option?.label || value,
      description: option?.description || "",
      Icon: option?.icon,
    };
  };

  const getWordCountDescription = (count: number) => {
    const descriptions = [
      { threshold: 100, text: "Brief Response - Perfect for quick thoughts" },
      {
        threshold: 350,
        text: "Short Article - Ideal for clear, concise ideas",
      },
      {
        threshold: 650,
        text: "Full Article - Room to develop your thoughts",
      },
      { threshold: 850, text: "In-Depth Piece - Space for rich detail" },
      {
        threshold: Infinity,
        text: "Comprehensive Essay - Full exploration of your topic",
      },
    ];
    return descriptions.find((d) => count <= d.threshold)?.text;
  };

  const ProfileItem = ({ icon: ItemIcon, label, title, description }) => (
    <Paper p="md" radius="sm" withBorder>
      <Group wrap="nowrap" gap="xl">
        {ItemIcon && (
          <ThemeIcon size="lg" variant="light" color="blue">
            <ItemIcon size={20} />
          </ThemeIcon>
        )}
        <div style={{ flex: 1 }}>
          <Text size="xs" tt="uppercase" fw={500} c="dimmed">
            {title}
          </Text>
          <Text size="sm" fw={500} mb={4}>
            {label}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={2}>
            {description}
          </Text>
        </div>
      </Group>
    </Paper>
  );

  const renderProfileDetails = () => {
    if (!profile) return null;

    const { wordCount, ...otherDetails } = profile;

    return (
      <Stack gap="xl">
        {wordCount && (
          <ProfileItem
            icon={FaBook}
            title="Target Word Count"
            label={`${wordCount} words`}
            description={getWordCountDescription(wordCount)}
          />
        )}

        {Object.entries(otherDetails).map(([key, value]) => {
          const { label, description, Icon } = findOptionDetails(
            key,
            value as string
          );
          return (
            <ProfileItem
              key={key}
              icon={Icon}
              title={key.replace(/([A-Z])/g, " $1").trim()}
              label={label}
              description={description}
            />
          );
        })}
      </Stack>
    );
  };

  if (!entries || !profile) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const numberOfEntriesInEachCategory = Object.values(
    entries.reduce(
      (acc, entry) => {
        if (!acc[entry.category]) {
          acc[entry.category] = { category: entry.category, count: 1 };
        } else {
          acc[entry.category].count += 1;
        }
        return acc;
      },
      NEW_PROMPT_CATEGORIES.reduce(
        (acc, category) => {
          acc[category.title] = { category: category.title, count: 0 };
          return acc;
        },
        {} as Record<string, { category: string; count: number }>
      )
    )
  );

  // Extract data for heatmap
  const heatmapData: { date: string; count: number; tooltip: string }[] =
    Object.values(
      entries.reduce(
        (acc, entry) => {
          const date = new Date(entry.created_at).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          if (!acc[date]) {
            acc[date] = { date, count: 1 };
          } else {
            acc[date].count += 1;
          }
          return acc;
        },
        {} as Record<string, { date: string; count: number }>
      )
    );

  const stackedChartData = entries.map((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString("en-CA", {
      month: "short",
      day: "2-digit",
    });

    return {
      date,
      "AI Characters":
        (entry.metadata_stats?.aiCharacters /
          entry.metadata_stats?.totalCharacters) *
        100,
      "User Characters":
        (entry.metadata_stats?.userCharacters /
          entry.metadata_stats?.totalCharacters) *
        100,
      "Mood Score": entry.ai_feedback?.mood?.score,
      "Relevance Score": entry.ai_feedback?.relevance?.score,
      "Creativity Score": entry.ai_feedback?.creativity?.score,
      "Readability Score": entry.ai_feedback?.readability?.score,
      "Completeness Score": entry.ai_feedback?.completeness?.score,
    };
  });

  const totalWords = entries.reduce((acc, entry) => {
    acc += entry.metadata_stats?.totalWords || 0;
    return acc;
  }, 0);

  const donutChartData = entries
    .map((entry) => ({
      User: entry.metadata_stats?.userCharacters || 0,
      AI: entry.metadata_stats?.aiCharacters || 0,
    }))
    .reduce(
      (acc, curr) => {
        acc[0].value += curr.User;
        acc[1].value += curr.AI;
        return acc;
      },
      [
        { name: "Human Words", color: "blue", value: 0 },
        { name: "AI Words", color: "grape", value: 0 },
      ]
    );

  const totalValues = donutChartData[0].value + donutChartData[1].value;

  const finalDonutChartData = donutChartData.map((item) => ({
    ...item,
    value: Math.floor((item.value / totalValues) * totalWords),
  }));

  return (
    <Grid>
      {/* Left sidebar */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack justify="space-between" h="100%" gap="xl">
            <Stack gap="md">
              <div>
                <Title order={3} mb={4}>
                  Hey there, {username}!
                </Title>
                <Text size="sm" c="dimmed">
                  {email}
                </Text>
              </div>
              {!profile ? (
                <Paper p="md" withBorder>
                  <Text mb="md">
                    It seems that your profile is not filled out at the moment,
                    click here to do so.
                  </Text>
                  <Button
                    onClick={() => router.push("/profile-quiz")}
                    variant="filled"
                    fullWidth
                  >
                    Fill Out Profile
                  </Button>
                </Paper>
              ) : (
                renderProfileDetails()
              )}
            </Stack>
          </Stack>
        </Card>
      </Grid.Col>

      {/* Right side charts */}
      <Grid.Col span={{ base: 12, md: 9 }}>
        <Group justify="space-between" align="center" w={"100%"}>
          <RadarChart
            h={300}
            data={numberOfEntriesInEachCategory}
            dataKey="category"
            series={[{ name: "count", color: "blue.4", opacity: 0.5 }]}
            withPolarAngleAxis
            withPolarRadiusAxis={false}
            flex={2}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text ta="center" size="xl">
              {entries.length} Entries
            </Text>
            <DonutChart
              withLabelsLine
              withLabels
              data={finalDonutChartData}
              startAngle={180}
              endAngle={0}
              size={250}
              thickness={20}
              h={300}
              chartLabel={`${totalWords} Total Words`}
            />
          </div>
        </Group>
        <Paper
          radius="sm"
          p="md"
          mt="md"
          mb="lg"
          bg={
            colorScheme === "dark"
              ? "var(--mantine-color-dark-7)"
              : "var(--mantine-color-gray-0)"
          }
        >
          <Heatmap data={heatmapData} />
        </Paper>
        <div>
          <CompositeChart
            h={300}
            data={stackedChartData}
            dataKey="date"
            curveType="monotone"
            xAxisLabel="Date"
            withLegend
            tickLine="none"
            gridAxis="y"
            legendProps={{ verticalAlign: "top", height: 50 }}
            yAxisLabel="Score"
            yAxisProps={{
              domain: [0, 10],
            }}
            series={[
              { name: "Mood Score", color: "yellow.4", type: "line" },
              { name: "Relevance Score", color: "blue.4", type: "line" },
              { name: "Creativity Score", color: "green.4", type: "line" },
              { name: "Readability Score", color: "red.4", type: "line" },
              { name: "Completeness Score", color: "violet.4", type: "line" },
            ]}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default StatCharts;
