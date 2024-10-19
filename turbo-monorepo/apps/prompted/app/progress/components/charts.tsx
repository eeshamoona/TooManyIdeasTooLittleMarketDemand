"use client";
import React from "react";
import { Title, Container } from "@mantine/core";
import { RadarChart } from "@mantine/charts";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";

interface StatChartsProps {
  // heatmapData: any;
  // radarChartData: any;
  entries: any[];
}

const StatCharts: React.FC<StatChartsProps> = ({ entries }) => {
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
        {} as Record<string, { category: string; count: number }>,
      ),
    ),
  );
  return (
    <Container>
      <div>
        <Title order={3}>Submission Frequency</Title>
        {/* Heatmap component goes here */}
      </div>

      <div>
        <Title order={3}>Prompt Categories</Title>
        <RadarChart
          h={300}
          data={numberOfEntriesInEachCategory}
          dataKey="category"
          withPolarRadiusAxis
          series={[{ name: "count", color: "blue.4", opacity: 0.5 }]}
        />
      </div>
    </Container>
  );
};

export default StatCharts;
