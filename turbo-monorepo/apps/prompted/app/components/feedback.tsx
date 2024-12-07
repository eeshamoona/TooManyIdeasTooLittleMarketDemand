import { Anchor, Box, Button, Group, Text, Textarea } from "@mantine/core";
import { useState } from "react";

function FeedbackForm() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    // TODO: Implement feedback submission logic
    console.log("Feedback submitted:", feedback);
    setFeedback("");
  };

  return (
    <Box p="md" mx="auto">
      <Text size="xs" mb="xs">
        Quickly send feedback or suggestions for Prompted:
      </Text>
      <Textarea
        placeholder="Share your thoughts with us"
        value={feedback}
        onChange={(e) => setFeedback(e.currentTarget.value)}
        minRows={3}
        mb="sm"
        resize="vertical"
      />
      <Group justify="apart" grow>
        <Button variant="subtle" fullWidth onClick={() => setFeedback("")}>
          Clear
        </Button>
        <Button fullWidth variant="light" onClick={handleSubmit}>
          Send feedback
        </Button>
      </Group>
      <Text size="xs" mt="sm" ta="center">
        Or join our{" "}
        <Anchor
          href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/discussions/66"
          type="button"
        >
          discussion board on Github!
        </Anchor>
      </Text>
    </Box>
  );
}

export default FeedbackForm;
