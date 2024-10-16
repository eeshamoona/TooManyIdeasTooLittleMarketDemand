"use client";
import { Card, Grid, Group, Rating, Stack, Text } from "@mantine/core";
import { useState } from "react";

const criteriaDescriptions = {
  completeness: "How complete is the writing?",
  mood: "How does the writing make you feel?",
  creativity: "How creative is the writing?",
  relevance: "Does the response directly address the prompt?",
  readability: "How easy is the writing to read?",
};

export type FeedbackCategory = {
  score: number;
  feedback: string;
};

export type FeedbackData = {
  completeness: FeedbackCategory;
  readability: FeedbackCategory;
  creativity: FeedbackCategory;
  mood: FeedbackCategory;
  relevance: FeedbackCategory;
};

type FeedbackPrompts = {
  feedbackData: FeedbackData;
};

export function FeedbackDisplay({ feedbackData }: FeedbackPrompts) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  //first order the feedbackData by the order of the criteriaDescriptions
  const orderedFeedbackData = Object.fromEntries(
    Object.entries(feedbackData).sort(
      ([criteriaA], [criteriaB]) =>
        Object.keys(criteriaDescriptions).indexOf(criteriaA) -
        Object.keys(criteriaDescriptions).indexOf(criteriaB)
    )
  );

  return (
    <Grid mt="sm" grow>
      {Object.entries(orderedFeedbackData).map(
        ([criteria, { score, feedback }], index) => {
          const span = index < 3 ? 4 : 6; // 4 cards on top row, 3 on bottom
          const height = index < 3 ? 150 : 125;

          return (
            <Grid.Col key={criteria} span={span}>
              <Card
                h={height}
                withBorder
                radius="md"
                p="sm"
                onMouseEnter={() => setHoveredCategory(criteria)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {hoveredCategory === criteria ? (
                  <Text size="xs">{feedback}</Text>
                ) : (
                  <Stack h="100%" justify="space-between">
                    <Stack justify="start" gap={0}>
                      <Text fz="md" tt="uppercase" fw={700}>
                        {criteria}
                      </Text>

                      <Text fz="sm" c="dimmed">
                        {criteriaDescriptions[criteria]}
                      </Text>
                    </Stack>
                    <Group justify="end">
                      <Rating
                        size={"md"}
                        readOnly
                        fractions={2}
                        value={score / 2}
                      />
                    </Group>
                  </Stack>
                )}
              </Card>
            </Grid.Col>
          );
        }
      )}
    </Grid>
  );
}
