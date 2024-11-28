import React from "react";
import { Paper } from "@mantine/core";
import Heatmap from "../../progress/components/heatmap";
import { useMantineColorScheme } from "@mantine/core";

interface HeatmapChartProps {
  heatmapData: any[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ heatmapData }) => {
  const { colorScheme } = useMantineColorScheme();

  return (
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
  );
};

export default HeatmapChart;