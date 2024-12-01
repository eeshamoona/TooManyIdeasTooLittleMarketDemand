import { DonutChart } from "@mantine/charts";
import { Grid, Text } from "@mantine/core";
import React from "react";

interface RadarAndDonutChartsProps {
  finalDonutChartData: any[];
  entriesLength: number;
  totalWords: number;
}

const DonutCharts: React.FC<RadarAndDonutChartsProps> = ({
  finalDonutChartData,
  entriesLength,
  totalWords,
}) => (
  <>
    <Grid.Col span={{ base: 12, md: 6 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text ta="center" size="xl">
          {entriesLength} Entries
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
    </Grid.Col>
  </>
);

export default DonutCharts;
