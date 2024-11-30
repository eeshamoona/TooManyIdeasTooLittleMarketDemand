"use client";
import { Box, Tabs } from "@mantine/core";
import React from "react";
import { Profile } from "../../../write/components/display";
import { FeedbackData, FeedbackDisplay } from "./feedback";
import { FeedbackRetry } from "./feedback-retry";
import { StatsGrid3 } from "./stats-grid";

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

  const getStats = () => {
    //Calculate the number of words AI wrote by multiplying the userPercentage by the totalWordCount
    const aiWordCount = Math.abs(
      Math.ceil(
        (entry.metadata_stats.userPercentage / 100) *
          entry.metadata_stats.totalWords
      ) - entry.metadata_stats.totalWords
    );

    return {
      ...entry.metadata_stats,
      aiWordCount,
      targetWordCount: profile.targetWordCount,
    };
  };

  return (
    <Tabs defaultValue="stats">
      <Tabs.List>
        <Tabs.Tab value="stats">Stats</Tabs.Tab>
        <Tabs.Tab value="feedback">Feedback</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="stats" pt="xs">
        <Box mt="md" style={{ flexShrink: 0 }}>
          <StatsGrid3 stats={getStats()} />
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
