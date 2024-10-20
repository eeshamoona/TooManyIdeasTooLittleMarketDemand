"use client";
import { Button, Text } from "@mantine/core";
import React, { useState } from "react";
import "./heatmap.css";
import CustomHeatmap from "./heatmap2";

import dynamic from "next/dynamic";
import { TooltipDataAttrs } from "react-calendar-heatmap";

const CalendarHeatmap = dynamic(() => import("react-calendar-heatmap"), {
  ssr: false,
});

interface HeatmapProps {
  data: { date: string; count: number }[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  const handlePreviousYear = () => {
    setYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setYear((prevYear) => prevYear + 1);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1em",
        }}
      >
        <Button variant="light" onClick={handlePreviousYear}>
          Previous Year
        </Button>
        <Text>{year}</Text>
        <Button variant="light" onClick={handleNextYear}>
          Next Year
        </Button>
      </div>

      <CustomHeatmap
        startDate={`${year}-01-01`}
        endDate={`${year}-12-31`}
        data={data}
      />
      {/* <CalendarHeatmap
        startDate={new Date(`${year}-01-01`)}
        endDate={new Date(`${year}-12-31`)}
        values={data}
        showMonthLabels
        showWeekdayLabels
        showOutOfRangeDays
        classForValue={(value) => {
          if (!value) {
            return "heatmap-rect color-empty";
          }
          return `color-scale-${Math.min(value.count, 10)}`;
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) {
            return {};
          }
          return {
            "data-tip": `${value.date}: ${value.count} entries`,
          } as TooltipDataAttrs;
        }}
        titleForValue={(value: { date: string; count: number }) =>
          value && value.date ? `${value.date}: ${value.count} entries` : ""
        }
      /> */}
    </div>
  );
};

export default Heatmap;
