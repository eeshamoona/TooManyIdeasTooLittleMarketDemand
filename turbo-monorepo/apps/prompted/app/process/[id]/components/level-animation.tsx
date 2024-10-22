import React, { useState, useEffect, useRef } from "react";
import LevelBadge from "../../../progress/components/level-badge";
import {
  Group,
  Progress,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { IoIosInfinite } from "react-icons/io";
import Confetti from "react-confetti"; // Import Confetti

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
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Incremental progress update for smooth animation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Get the container width
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
    }

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
      setShowConfetti(true);
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

        // Trigger confetti when the level changes
        setTimeout(() => setShowConfetti(false), 3000); // Show confetti for 3 seconds
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
      ref={containerRef}
      style={{
        margin: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        position: "relative", // Ensure relative positioning for confetti
      }}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={containerWidth}
          height={containerHeight}
          recycle={false}
        />
      )}

      <Group justify="center" align="center" gap="xs">
        {/* Level Badge with Icon */}
        <LevelBadge
          level={isTransitioning ? levelInfo.endLevel : currentLevel}
          icon={icon}
        />
        {/* Title and Description */}
        <div style={{ textAlign: "center" }}>
          <Text fw={"bold"} size="lg">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </div>
      </Group>

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
