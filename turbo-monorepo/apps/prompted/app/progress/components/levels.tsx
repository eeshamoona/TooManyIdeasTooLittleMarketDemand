import React from "react";
import { Progress, Group, Text, Tooltip, Card } from "@mantine/core"; // Using Mantine's ProgressBar component
import { ProgressModel } from "../interface";

interface LevelProgressPageProps {
  progressBadgeData: ProgressModel[];
}

const LevelProgressPage: React.FC<LevelProgressPageProps> = ({
  progressBadgeData,
}) => {
  const getProgressInfo = (progress: number, thresholds: number[]) => {
    let lowThreshold = 0;
    let highThreshold = Infinity;
    let level = 1;

    for (let i = 1; i < thresholds.length; i++) {
      if (progress >= thresholds[i]) {
        lowThreshold = thresholds[i];
        // i+2 because the first level would be level 2 if user crosses the first threshold
        level = i + 2;
      } else {
        highThreshold = thresholds[i];
        break;
      }
    }
    const progressValue =
      ((progress - lowThreshold) / (highThreshold - lowThreshold)) * 100;

    return { lowThreshold, highThreshold, progressValue, level };
  };

  const renderContent = () => {
    const enhancedProgressData = progressBadgeData.map((PBadge) => {
      const progressInfo = getProgressInfo(
        PBadge.progress,
        PBadge.badges.thresholds
      );
      return {
        ...PBadge,
        progressInfo,
      };
    });

    enhancedProgressData.sort(
      (a, b) => b.progressInfo.progressValue - a.progressInfo.progressValue
    );

    return enhancedProgressData.map((PBadge) => {
      return (
        <Card key={PBadge.id}>
          <div>Level {PBadge.progressInfo.level}</div>
          <div>{PBadge.badges.title}</div>
          <div>{PBadge.badges.description}</div>
          <Group align="center">
            <Text>{PBadge.progressInfo.lowThreshold}</Text>
            <Tooltip label={`${PBadge.progress}`} withArrow>
              <Progress flex={1} value={PBadge.progressInfo.progressValue} />
            </Tooltip>
            <Text>{PBadge.progressInfo.highThreshold}</Text>
          </Group>
        </Card>
      );
    });
  };

  return <div>{renderContent()}</div>;
};

export default LevelProgressPage;
