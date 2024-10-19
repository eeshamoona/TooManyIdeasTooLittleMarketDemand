import React from "react";
import { Progress, Group, Text, Tooltip, Card, Grid } from "@mantine/core"; // Using Mantine's ProgressBar component
import { getProgressInfo, ProgressModel } from "../interface";
import LevelBadge from "./level-badge";

interface LevelProgressPageProps {
  progressBadgeData: ProgressModel[];
}

const LevelProgressPage: React.FC<LevelProgressPageProps> = ({
  progressBadgeData,
}) => {
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
        <Grid.Col key={PBadge.id} span={4}>
          <Card>
            <LevelBadge
              level={PBadge.progressInfo.level}
              icon={PBadge.badges.icon}
            />
            <div>{PBadge.badges.title}</div>
            <div>{PBadge.badges.description}</div>
            <Group align="center">
              <Text>{PBadge.progressInfo.lowThreshold}</Text>
              <Tooltip
                label={`${PBadge.progress} ${PBadge.badges.label}`}
                withArrow
              >
                <Progress flex={1} value={PBadge.progressInfo.progressValue} />
              </Tooltip>
              <Text>{PBadge.progressInfo.highThreshold}</Text>
            </Group>
          </Card>
        </Grid.Col>
      );
    });
  };

  return <Grid>{renderContent()}</Grid>;
};

export default LevelProgressPage;
