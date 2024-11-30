"use client";
import { Button, Center, Stack, Text } from "@mantine/core";
import { useState } from "react";

interface FeedbackRetryProps {
  entryId: string;
  text: string;
  category: string;
  prompt: string;
}

export function FeedbackRetry({
  entryId,
  text,
  category,
  prompt,
}: FeedbackRetryProps) {
  const [isLoading, setIsLoading] = useState(false);

  console.log("entryId", entryId);
  console.log("response", text);
  console.log("category", category);
  console.log("prompt", prompt);

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      const feedbackResponse = await fetch("/api/getAiFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: text,
          category,
          prompt,
        }),
      });

      if (!feedbackResponse.ok) {
        throw new Error("Failed to generate feedback");
      }

      const { aiFeedback } = await feedbackResponse.json();
      console.log("aiFeedback", aiFeedback);

      //TODO: Update the entry in the database with the new feedback
    } catch (error) {
      console.error("Error generating feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center>
      <Stack align="center" gap="md">
        <Text c="dimmed">No AI feedback found for this entry.</Text>
        <Button
          onClick={handleRetry}
          loading={isLoading}
          variant="light"
          color="blue"
        >
          Retry AI Feedback
        </Button>
      </Stack>
    </Center>
  );
}
