import React, { useState, useEffect } from "react";
import LevelBadge from "../../../progress/components/level-badge";
import { Progress, Text } from "@mantine/core";
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
}

const LevelProgressAnimation: React.FC<LevelProgressAnimationProps> = ({
  levelInfo,
  title,
  description,
  icon,
}) => {
  const [progress, setProgress] = useState(levelInfo.startProgressValue);
  const [currentLevel, setCurrentLevel] = useState(levelInfo.startLevel);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animate the progress bar filling up to 100%, then reset and continue with next phase.
  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;

    // Stage 1: Animate the progress to 100%
    if (!isTransitioning) {
      animationTimeout = setTimeout(() => {
        setProgress(levelInfo.startHighValue); // Complete first progress bar phase
        setIsTransitioning(true); // Move to next phase
      }, 1000); // Time to fill progress bar to 100% (can adjust for animation speed)
    }

    // Stage 2: Reset and animate the progress from endLowValue to endProgressValue
    if (isTransitioning) {
      animationTimeout = setTimeout(() => {
        setProgress(levelInfo.endProgressValue); // Animate to the final progress value
        if (currentLevel < levelInfo.endLevel) {
          setCurrentLevel(levelInfo.endLevel); // Set the final level
        }
      }, 1000); // Time delay before starting the second phase animation
    }

    return () => clearTimeout(animationTimeout); // Cleanup timeout
  }, [
    isTransitioning,
    currentLevel,
    levelInfo.endProgressValue,
    levelInfo.endLevel,
  ]);

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
          <p>
            Level {currentLevel} → Level {levelInfo.endLevel}
          </p>
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: "5px" }}>
        {!isTransitioning ? (
          <>
            <Text size="sm" fw={500}>
              {levelInfo.startLowValue}
            </Text>
            <Progress.Root size={8} flex={1} radius="sm">
              <Progress.Section
                value={progress}
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
            <Progress.Root size={8} flex={1} radius="sm">
              <Progress.Section
                value={progress}
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
      </div>
    </div>
  );
};

export default LevelProgressAnimation;
