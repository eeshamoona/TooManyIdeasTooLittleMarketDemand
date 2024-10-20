"use client";
import React from "react";
import { Group, Paper, useMantineColorScheme } from "@mantine/core";
import { CompositeChart, DonutChart, RadarChart } from "@mantine/charts";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import Heatmap from "./heatmap";

interface StatChartsProps {
  entries: any[];
}

const StatCharts: React.FC<StatChartsProps> = ({ entries }) => {
  const { colorScheme } = useMantineColorScheme();
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
    <>
      <Paper
        radius="sm"
        p="md"
        my="lg"
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
      <Group justify="space-between" w={"100%"}>
        <RadarChart
          h={300}
          data={numberOfEntriesInEachCategory}
          dataKey="category"
          series={[{ name: "count", color: "blue.4", opacity: 0.5 }]}
          withPolarAngleAxis
          withPolarRadiusAxis={false}
          flex={1}
        />
        <DonutChart
          withLabelsLine
          withLabels
          data={finalDonutChartData}
          startAngle={180}
          endAngle={0}
          size={250}
          thickness={20}
          chartLabel={`${totalWords} Total Words`}
        />
      </Group>
    </>
  );
};

export default StatCharts;
