import React from "react";

type CustomHeatmapProps = {
  startDate: string;
  endDate: string;
  data: { date: string; count: number }[];
};

const CustomHeatmap: React.FC<CustomHeatmapProps> = ({
  startDate,
  endDate,
  data,
}: CustomHeatmapProps) => {
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);

  // Helper functions to calculate previous Sunday and next Saturday
  const getPreviousSunday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  const getNextSaturday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    return d;
  };

  const firstSunday = getPreviousSunday(startingDate);
  const lastSaturday = getNextSaturday(endingDate);

  const totalDays =
    (lastSaturday.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24) +
    1;

  // Create the grid including padding for Sundays and Saturdays
  const calendarGrid = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(firstSunday);
    date.setDate(date.getDate() + i);
    return date.toISOString().slice(0, 10);
  });

  const highestValue = data?.reduce((a, b) => Math.max(a, b.count), -Infinity);

  const getIntensity = (activityCount: number) => {
    return highestValue !== 0 ? Number(activityCount / highestValue) : 0;
  };

  const getColorFromIntensity = (intensity: number) => {
    const colorCodes = [
      "#FFEEEE",
      "#FFCCCC",
      "#FFAAAA",
      "#FF8888",
      "#FF6666",
      "#FF4444",
    ];
    const colorIndex = Math.min(
      Math.floor(intensity * colorCodes.length),
      colorCodes.length - 1
    );
    return colorCodes[colorIndex];
  };

  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gap: "4px",
        gridTemplateRows: "repeat(7, minmax(0, 1fr))",
      }}
    >
      {calendarGrid.map((day) => {
        const entry = data.find((d) => d.date === day);
        const entryCount = entry ? entry.count : 0;
        const formattedDay = new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
        });

        const intensity = getIntensity(entryCount);
        const color = getColorFromIntensity(intensity);

        return (
          <span
            key={day}
            style={{
              display: "inline-block",
              width: "16px",
              height: "16px",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: `${entryCount === 0 ? "#ffffff10" : String(color)}`,
            }}
            title={`${entryCount} entr${entryCount === 1 ? "y" : "ies"} on ${formattedDay}`}
          />
        );
      })}
    </div>
  );
};

export default CustomHeatmap;
