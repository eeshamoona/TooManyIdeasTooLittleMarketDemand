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
        <Grid.Col
          key={PBadge.id}
          span={{ base: 8, xs: 6, sm: 4, md: 3, lg: 3, xl: 3 }}
        >
          <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group justify="center" align="center" gap="xs">
              {/* Level Badge with Icon */}
              <LevelBadge
                level={PBadge.progressInfo.level}
                icon={PBadge.badges.icon}
              />
              {/* Title and Description */}
              <div style={{ textAlign: "center" }}>
                <Text fw={"bold"} size="lg">
                  {PBadge.badges.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {PBadge.badges.description}
                </Text>
              </div>
            </Group>

            {/* Progress Bar with Tooltip */}
            <Group align="center" mt="md" gap="xs">
              <Text size="sm" fw={500}>
                {PBadge.progressInfo.lowThreshold}
              </Text>
              <Tooltip
                label={`${PBadge.progress} ${PBadge.badges.label}`}
                withArrow
              >
                <Progress
                  flex={1}
                  size="sm"
                  value={PBadge.progressInfo.progressValue}
                  color="blue"
                  radius="sm"
                />
              </Tooltip>
              <Text size="sm" fw={500}>
                {PBadge.progressInfo.highThreshold}
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      );
    });
  };

  return <Grid justify="center">{renderContent()}</Grid>;
};

export default LevelProgressPage;
