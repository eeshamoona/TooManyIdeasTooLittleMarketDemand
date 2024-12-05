"use client";
import { Container, Tabs } from "@mantine/core";
import { ProgressModel } from "../interface";
import LevelProgressPage from "./levels";
import MilestoneBadges from "./milestone";

interface DisplayProps {
  entries: any[];
  progress: ProgressModel[];
}

export default function Display({ progress }: DisplayProps) {
  const level_badges = progress.filter((badge) => badge.hasLevels);
  const milestone_badges = progress.filter((badge) => !badge.hasLevels);

  return (
    <>
      <Tabs mt="xl" defaultValue="levels">
        <Tabs.List justify="center" grow mb="md">
          <Tabs.Tab value="levels">Levels</Tabs.Tab>
          <Tabs.Tab value="milestones">Milestones</Tabs.Tab>
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
      </Tabs>
    </>
  );
}
