import { Title, Anchor, Text, Stack } from "@mantine/core";

const MagicLinkContent: React.FC = () => {
  return (
    <Stack align="center" gap="md" mb="lg">
      <Title order={2}>✨ Magic Link Sent!</Title>
      <Text ta="center">
        Check your inbox for the magic link to log in and get back to writing!
      </Text>
      <Text ta="center">
        Didn’t get it?{" "}
        <Anchor href="/login" variant="link">
          Send another link
        </Anchor>{" "}
        or try again in a few minutes.
      </Text>
    </Stack>
  );
};

export default MagicLinkContent;
