import {
  Card,
  Group,
  Progress,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { IoIosInfinite } from "react-icons/io";
import LevelBadge from "../../../progress/components/level-badge";

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
  animated: boolean;
}

const LevelProgressAnimation: React.FC<LevelProgressAnimationProps> = ({
  levelInfo,
  title,
  description,
  icon,
  label,
  animated,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const [progress, setProgress] = useState(
    animated ? levelInfo.startProgressValue : levelInfo.endProgressValue
  );
  const [currentLevel, setCurrentLevel] = useState(
    animated ? levelInfo.startLevel : levelInfo.endLevel
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Incremental progress update for smooth animation
  useEffect(() => {
    if (!animated) {
      // If animation is disabled, skip to the end state
      setProgress(levelInfo.endProgressValue);
      setCurrentLevel(levelInfo.endLevel);
      setIsTransitioning(true);
      return;
    }

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
        setTimeout(() => setShowConfetti(false), 2000); // Show confetti for 3 seconds
      }
    }

    return () => clearInterval(timer); // Cleanup interval
  }, [isTransitioning, currentLevel, levelInfo, animated]);

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
    <Card
      withBorder
      ref={containerRef}
      style={{
        margin: "20px",
        padding: "20px",
        borderRadius: "10px",
        height: "fit-content",
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
        <LevelBadge level={currentLevel} icon={icon} />
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
              <Progress.Root size={10} flex={1} radius="sm">
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
            <>
              <Text size="sm" fw={500}>
                {levelInfo.endLowValue}
              </Text>
              <Progress.Root size={10} flex={1} radius="sm">
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
    </Card>
  );
};

export default LevelProgressAnimation;
