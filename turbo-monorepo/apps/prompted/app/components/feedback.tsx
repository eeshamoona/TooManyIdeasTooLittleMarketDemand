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

function FeedbackForm() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    // TODO: Implement feedback submission logic
    console.log("Feedback submitted:", feedback);
    //Send email to admin@writeprompted.com
    const email = "admin@writeprompted.com";
    const subject = "Prompted Feedback";
    const body = feedback;
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setFeedback("");
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
        <Button size="xs" flex={1} onClick={handleSubmit}>
          Send Feedback
        </Button>
      </Group>

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
