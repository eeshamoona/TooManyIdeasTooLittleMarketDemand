import { Tooltip, useMantineColorScheme, useMantineTheme } from "@mantine/core";
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
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);

  // Helper functions to calculate the previous Sunday and the next Saturday
  const getPreviousSunday = (date: Date) => {
    const d = new Date(date);
    while (d.getDay() !== 0) {
      d.setDate(d.getDate() - 1);
    }
    return d;
  };

  const getNextSaturday = (date: Date) => {
    const d = new Date(date);
    while (d.getDay() !== 6) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  };

  const firstSunday = getPreviousSunday(startingDate);
  const lastSaturday = getNextSaturday(endingDate);

  // Create the grid as an array of weeks, each week being an array of days
  const calendarGrid: string[][] = [];
  let currentDate = new Date(firstSunday);

  while (currentDate <= lastSaturday) {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      // Format the date as 'YYYY-MM-DD' in local time
      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      week.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    calendarGrid.push(week);
  }

  const highestValue = data?.reduce((a, b) => Math.max(a, b.count), -Infinity);

  const getIntensity = (activityCount: number) => {
    return highestValue !== 0 ? activityCount / highestValue : 0;
  };

  const getColorFromIntensity = (intensity: number) => {
    const colorCodes = theme.colors.blue; // Use the 'blue' color scale from Mantine
    const colorIndex = Math.min(
      Math.floor(intensity * colorCodes.length),
      colorCodes.length - 1
    );
    return colorCodes[colorIndex];
  };

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "3px",
        }}
      >
        {calendarGrid.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{
              display: "grid",
              gridTemplateRows: "repeat(7, minmax(0, 1fr))",
              gap: "2px",
              width: "15px",
            }}
          >
            {week.map((day) => {
              const entry = data.find((d) => d.date === day);
              const entryCount = entry ? entry.count : 0;
              const [year, month, dayPart] = day.split("-").map(Number);
              const dateObj = new Date(year, month - 1, dayPart);
              const formattedDay = dateObj.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit",
              });

              const intensity = getIntensity(entryCount);
              const color = getColorFromIntensity(intensity);

              return (
                <Tooltip
                  key={day}
                  label={`${entryCount} entr${entryCount === 1 ? "y" : "ies"} on ${formattedDay}`}
                  openDelay={100}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor: `${
                        entryCount === 0
                          ? colorScheme === "dark"
                            ? "var(--mantine-color-dark-5)"
                            : "var(--mantine-color-gray-3)"
                          : String(color)
                      }`,
                    }}
                  />
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomHeatmap;
