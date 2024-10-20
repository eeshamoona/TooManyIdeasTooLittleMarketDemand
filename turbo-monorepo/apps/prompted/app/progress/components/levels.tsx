import React from "react";
import {
  Progress,
  Group,
  Text,
  Tooltip,
  Card,
  Grid,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { getProgressInfo, ProgressModel } from "../interface";
import LevelBadge from "./level-badge";
import { IoIosInfinite } from "react-icons/io";

interface LevelProgressPageProps {
  progressBadgeData: ProgressModel[];
}

const LevelProgressPage: React.FC<LevelProgressPageProps> = ({
  progressBadgeData,
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
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
    enhancedProgressData.sort((a, b) => {
      if (a.progressInfo.level >= 6 || b.progressInfo.level >= 6) {
        return 0;
      }
      return b.progressInfo.progressValue - a.progressInfo.progressValue;
    });
    return enhancedProgressData.map((PBadge) => {
      return (
        <Grid.Col
          key={PBadge.id}
          span={{ base: 8, xs: 6, sm: 4, md: 3, lg: 3, xl: 3 }}
        >
          <Card
            shadow="md"
            padding="lg"
            radius="md"
            withBorder
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = theme.shadows.md;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
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
            <Tooltip
              bg={"transparent"}
              label={`${PBadge.progress} ${PBadge.badges.label}`}
              withArrow
              c={colorScheme === "dark" ? "gray" : "dark"}
              position="bottom"
              offset={-5}
            >
              <Group
                align="center"
                my="md"
                gap="xs"
                style={{
                  cursor: "pointer",
                }}
              >
                <Text size="sm" fw={500}>
                  {PBadge.progressInfo.lowThreshold}
                </Text>

                <Progress.Root size={8} flex={1} radius="sm">
                  <Progress.Section
                    value={PBadge.progressInfo.progressValue}
                    color="blue"
                  ></Progress.Section>
                </Progress.Root>
                <Text size="sm" fw={500}>
                  {PBadge.progressInfo.highThreshold === Infinity ? (
                    <IoIosInfinite />
                  ) : (
                    PBadge.progressInfo.highThreshold
                  )}
                </Text>
              </Group>
            </Tooltip>

            {/* </Tooltip> */}
          </Card>
        </Grid.Col>
      );
    });
  };

  return <Grid justify="center">{renderContent()}</Grid>;
};

export default LevelProgressPage;
