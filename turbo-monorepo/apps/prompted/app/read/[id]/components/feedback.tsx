"use client";
import { Card, Grid, Group, Rating, Stack, Text } from "@mantine/core";
import { useMemo, useState } from "react";

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
  const orderedFeedbackData = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(feedbackData).sort(
          ([criteriaA], [criteriaB]) =>
            Object.keys(criteriaDescriptions).indexOf(criteriaA) -
            Object.keys(criteriaDescriptions).indexOf(criteriaB)
        )
      ),
    [feedbackData]
  );

  return (
    <Grid mt="sm" grow>
      {Object.entries(orderedFeedbackData).map(
        ([criteria, { score, feedback }], index) => {
          const span = {
            xs: 12,
            sm: index < 3 ? 4 : 6,
          };
          const height = 100;

          return (
            <Grid.Col key={criteria} span={span}>
              <Card
                h={height}
                withBorder
                radius="md"
                p="xs"
                onMouseEnter={() => setHoveredCategory(criteria)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {hoveredCategory === criteria ? (
                  <Text
                    size="xs"
                    style={{
                      overflowY: "auto",
                      maxHeight: "80px",
                      height: "100%",
                    }}
                  >
                    {feedback}
                  </Text>
                ) : (
                  <Stack h="100%" justify="space-between" gap="xs">
                    <Stack justify="start" gap={0}>
                      <Text fz="sm" tt="uppercase" fw={700}>
                        {criteria}
                      </Text>
                      <Text fz="xs" c="dimmed">
                        {criteriaDescriptions[criteria]}
                      </Text>
                    </Stack>
                    <Group justify="end">
                      <Rating
                        size="sm"
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
