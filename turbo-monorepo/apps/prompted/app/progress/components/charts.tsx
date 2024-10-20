"use client";
import React from "react";
import { Container } from "@mantine/core";
import { AreaChart, RadarChart } from "@mantine/charts";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import Heatmap from "./heatmap";

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
          console.log("date", date);
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
      "AI Characters": entry.metadata_stats?.aiCharacters,
      "User Characters": entry.metadata_stats?.userCharacters,
    };
  });

  return (
    <Container>
      <div>
        <Heatmap data={heatmapData} />
      </div>

      <div>
        <AreaChart
          h={300}
          data={stackedChartData}
          dataKey="date"
          type="stacked"
          xAxisLabel="Date"
          yAxisLabel=" Total Character Count"
          series={[
            { name: "AI Characters", color: "grape.6" },
            { name: "User Characters", color: "blue.7" },
          ]}
        />
      </div>
      <div>
        <RadarChart
          h={300}
          w={700}
          data={numberOfEntriesInEachCategory}
          dataKey="category"
          series={[{ name: "count", color: "blue.4", opacity: 0.5 }]}
          withPolarAngleAxis
          withPolarRadiusAxis={false}
        />
      </div>
    </Container>
  );
};

export default StatCharts;
