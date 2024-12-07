import {
  Anchor,
  Button,
  Container,
  Group,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useState } from "react";

function FeedbackForm({ userEmail }: { userEmail: string }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Prepare the feedback data
    const feedbackData = {
      userEmail: userEmail,
      message: feedback,
    };

    setLoading(true);
    setConfirmation("");

    try {
      // Send feedback to the API
      const response = await fetch("/api/sendFeedbackEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }

      const result = await response.json();
      console.log("Feedback submitted:", result.message);
      setFeedback(""); // Clear the feedback input
      setConfirmation("Feedback sent successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Error sending feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" px="0">
      {/* Header Section */}
      <Title order={5} mb="3">
        Feedback
      </Title>
      <Text size="xs" c="dimmed" mb="md">
        We’d love to hear your thoughts or suggestions for improving Prompted!
      </Text>

      {/* Feedback Input */}
      <Textarea
        placeholder="What’s on your mind?"
        value={feedback}
        size="sm"
        onChange={(e) => setFeedback(e.currentTarget.value)}
        minRows={3}
        mb="sm"
      />

      {/* Button Group */}
      <Group dir="column" gap="xs" w="100%">
        <Button size="xs" variant="default" onClick={() => setFeedback("")}>
          Clear
        </Button>
        <Button size="xs" flex={1} onClick={handleSubmit} disabled={loading}>
          {loading ? "Sending..." : "Send Feedback"}
        </Button>
      </Group>

      {/* Confirmation Message */}
      {confirmation && (
        <Text size="xs" c="green" mt="md" ta="center">
          {confirmation}
        </Text>
      )}

      {/* Error Message */}
      {error && (
        <Text size="xs" c="red" mt="md" ta="center">
          {error}
        </Text>
      )}

      {/* Footer Section */}
      <Text size="xs" c="dimmed" mt="md" ta="center">
        Want to discuss more? Join our{" "}
        <Anchor
          href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/discussions/66"
          target="_blank"
        >
          GitHub Community
        </Anchor>
      </Text>
    </Container>
  );
}

export default FeedbackForm;
