import React, { useState, useEffect } from "react";
import LevelBadge from "../../../progress/components/level-badge";
import {
  Group,
  Progress,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { IoIosInfinite } from "react-icons/io";

export interface LevelInformation {
  startLevel: number;
  endLevel: number;
  startLowValue: number;
  startHighValue: number;
  endLowValue: number;
  endHighValue: number | "Infinity";
  startProgressValue: number;
  endProgressValue: number;
}

export interface LevelProgressAnimationProps {
  levelInfo: LevelInformation;
  title: string;
  description: string;
  icon: string;
  label: string;
}

const LevelProgressAnimation: React.FC<LevelProgressAnimationProps> = ({
  levelInfo,
  title,
  description,
  icon,
  label,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const [progress, setProgress] = useState(levelInfo.startProgressValue);
  const [currentLevel, setCurrentLevel] = useState(levelInfo.startLevel);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Incremental progress update for smooth animation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Stage 1: Animate the progress to 100%
    if (!isTransitioning) {
      setTimeout(() => {
        timer = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = prevProgress + 1;
            if (newProgress >= levelInfo.startHighValue) {
              setProgress(levelInfo.startHighValue); // Ensure it stops exactly at 100%
              setIsTransitioning(true); // Move to the next phase
              clearInterval(timer);
            }
            return newProgress;
          });
        }, 50);
      }, 1000);
    }

    // Stage 2: Reset and animate the progress from endLowValue to endProgressValue
    if (isTransitioning) {
      setProgress(levelInfo.endLowValue); // Reset the progress bar for second phase
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          if (newProgress >= levelInfo.endProgressValue) {
            setProgress(levelInfo.endProgressValue);
            clearInterval(timer);
          }
          return newProgress;
        });
      }, 50);

      // Update level once the transition starts
      if (currentLevel < levelInfo.endLevel) {
        setCurrentLevel(levelInfo.endLevel);
      }
    }

    return () => clearInterval(timer); // Cleanup interval
  }, [isTransitioning, currentLevel, levelInfo]);

  // Calculate progress percentage based on the stage
  const endHighValue =
    levelInfo.endHighValue === "Infinity"
      ? progress + 40
      : levelInfo.endHighValue;

  const progressPercentage = isTransitioning
    ? ((progress - levelInfo.endLowValue) /
        (endHighValue - levelInfo.endLowValue)) *
      100
    : ((progress - levelInfo.startLowValue) /
        (levelInfo.startHighValue - levelInfo.startLowValue)) *
      100;

  return (
    <div
      style={{
        margin: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "20px" }}>
          <LevelBadge
            level={isTransitioning ? levelInfo.endLevel : currentLevel}
            icon={icon}
          />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <Tooltip
        bg={"transparent"}
        label={`${progress} ${label}`}
        withArrow
        c={colorScheme === "dark" ? "gray" : "dark"}
        position="bottom"
        offset={-5}
        opened={true} // Always show the tooltip
      >
        <Group
          align="center"
          my="md"
          gap="xs"
          style={{
            cursor: "pointer",
          }}
        >
          {!isTransitioning ? (
            <>
              <Text size="sm" fw={500}>
                {levelInfo.startLowValue}
              </Text>
              <Progress.Root flex={1} radius="sm">
                <Progress.Section
                  key="start-progress"
                  value={progressPercentage}
                  color="blue"
                ></Progress.Section>
              </Progress.Root>
              <Text size="sm" fw={500}>
                {levelInfo.startHighValue}
              </Text>
            </>
          ) : (
            // End Progress
            <>
              <Text size="sm" fw={500}>
                {levelInfo.endLowValue}
              </Text>
              <Progress.Root flex={1} radius="sm">
                <Progress.Section
                  key="end-progress"
                  value={progressPercentage}
                  color="blue"
                ></Progress.Section>
              </Progress.Root>
              <Text size="sm" fw={500}>
                {levelInfo.endHighValue === "Infinity" ? (
                  <IoIosInfinite />
                ) : (
                  levelInfo.endHighValue
                )}
              </Text>
            </>
          )}
        </Group>
      </Tooltip>
    </div>
  );
};

export default LevelProgressAnimation;
