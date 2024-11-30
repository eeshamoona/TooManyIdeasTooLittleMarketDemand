"use client";
import { Box, Tabs } from "@mantine/core";
import React from "react";
import { StatsGrid3 } from "../components/stats-grid";
import { FeedbackData, FeedbackDisplay } from "./feedback";

interface InfoProps {
  entry: {
    metadata_stats: any;
    ai_feedback: FeedbackData;
  };
}

const Info: React.FC<InfoProps> = ({ entry }) => {
  return (
    <Tabs defaultValue="stats">
      <Tabs.List>
        <Tabs.Tab value="stats">Stats</Tabs.Tab>
        <Tabs.Tab value="feedback">Feedback</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="stats" pt="xs">
        <Box mt="md" style={{ flexShrink: 0 }}>
          <StatsGrid3 stats={entry.metadata_stats} />
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value="feedback" pt="xs">
        <Box mt="md" style={{ flexShrink: 0 }}>
          <FeedbackDisplay feedbackData={entry.ai_feedback} />
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Info;
