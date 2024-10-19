"use client";
import { Tabs } from "@mantine/core";
import Charts from "./charts";
import MilestoneBadges from "./milestone";
import LevelProgressPage from "./levels";
import { ProgressModel } from "../interface";

interface DisplayProps {
  entries: any[];
  progress: ProgressModel[];
}

export default function Display({ entries, progress }: DisplayProps) {
  const level_badges = progress.filter((badge) => badge.hasLevels);
  const milestone_badges = progress.filter((badge) => !badge.hasLevels);

  return (
    <>
      <Tabs defaultValue="levels" variant="pills">
        <Tabs.List justify="center" grow>
          <Tabs.Tab value="levels">Levels</Tabs.Tab>
          <Tabs.Tab value="milestones">Milestones</Tabs.Tab>
          <Tabs.Tab value="charts">Charts</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="levels" pt="xs">
          <LevelProgressPage progressBadgeData={level_badges} />
        </Tabs.Panel>
        <Tabs.Panel value="milestones" pt="xs">
          <MilestoneBadges badges={milestone_badges} />
        </Tabs.Panel>
        <Tabs.Panel value="charts" pt="xs">
          <Charts entries={entries} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
