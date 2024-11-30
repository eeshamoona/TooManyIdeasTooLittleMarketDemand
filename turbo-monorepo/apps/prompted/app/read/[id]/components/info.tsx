"use client";
import React from "react";
import { Tabs, Box } from "@mantine/core";
import { StatsGrid3 } from "../components/stats-grid";
import { FeedbackData } from "./feedback";
import { FeedbackDisplay } from "./feedback";
import { FeedbackRetry } from "./feedback-retry";

interface InfoProps {
  entry: {
    metadata_stats: any;
    ai_feedback: FeedbackData;
    id: string;
    text: string;
    category: string;
    prompt: string;
  };
}

const Info: React.FC<InfoProps> = ({ entry }) => {
  const isFeedbackEmpty =
    !entry.ai_feedback || Object.keys(entry.ai_feedback).length === 0;

  console.log(entry);
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
