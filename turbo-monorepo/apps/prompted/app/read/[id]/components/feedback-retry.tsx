"use client";
import { Button, Center, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Profile } from "../../../write/components/display";
import { updateEntryFeedback } from "../actions";

interface FeedbackRetryProps {
  entryId: string;
  text: string;
  category: string;
  prompt: string;
  profile: Profile;
}

export function FeedbackRetry({
  entryId,
  text,
  category,
  prompt,
  profile,
}: FeedbackRetryProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
          profile,
        }),
      });

      if (!feedbackResponse.ok) {
        throw new Error("Failed to generate feedback");
      }

      const { aiFeedback } = await feedbackResponse.json();

      const parsedFeedback =
        typeof aiFeedback === "string" ? JSON.parse(aiFeedback) : aiFeedback;

      await updateEntryFeedback(entryId, parsedFeedback);
      console.log("Entry feedback updated");
      router.refresh();
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
          loaderProps={{ type: "dots" }}
          variant="light"
          color="blue"
        >
          Retry AI Feedback
        </Button>
      </Stack>
    </Center>
  );
}
