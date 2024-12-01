"use client";
import { Box, Tabs } from "@mantine/core";
import React from "react";
import { StatsGrid3 } from "../components/stats-grid";
import { FeedbackData, FeedbackDisplay } from "./feedback";
import { FeedbackRetry } from "./feedback-retry";
import { Profile } from "../../../write/components/display";

interface InfoProps {
  entry: {
    metadata_stats: any;
    ai_feedback: FeedbackData;
    id: string;
    text: string;
    category: string;
    prompt: string;
  };
  profile: Profile;
}

const Info: React.FC<InfoProps> = ({ entry, profile }) => {
  const isFeedbackEmpty =
    !entry.ai_feedback || Object.keys(entry.ai_feedback).length === 0;

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
          {isFeedbackEmpty ? (
            <FeedbackRetry
              entryId={entry.id}
              text={entry.text}
              category={entry.category}
              prompt={entry.prompt}
              profile={profile}
            />
          ) : (
            <FeedbackDisplay feedbackData={entry.ai_feedback} />
          )}
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Info;
