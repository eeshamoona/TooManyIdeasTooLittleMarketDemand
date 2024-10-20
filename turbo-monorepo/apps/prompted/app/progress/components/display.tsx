"use client";
import { Container, Tabs } from "@mantine/core";
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
      <Tabs mt="xl" defaultValue="levels">
        <Tabs.List justify="center" grow mb="md">
          <Tabs.Tab value="levels">Levels</Tabs.Tab>
          <Tabs.Tab value="milestones">Milestones</Tabs.Tab>
          <Tabs.Tab value="charts">Charts</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          value="levels"
          style={{
            height: "75vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <LevelProgressPage progressBadgeData={level_badges} />
        </Tabs.Panel>
        <Tabs.Panel value="milestones">
          <Container
            fluid
            style={{
              height: "75vh",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <MilestoneBadges badges={milestone_badges} />
          </Container>
        </Tabs.Panel>
        <Tabs.Panel value="charts">
          <Container
            fluid
            style={{
              height: "75vh",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <Charts entries={entries} />
          </Container>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
