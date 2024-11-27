import { Title, Anchor, Text, Button, Stack } from "@mantine/core";

const SignupContent: React.FC = () => {
  return (
    <Stack align="center" gap="md" mb="lg">
      <Title order={2}>📬 Almost There!</Title>
      <Text ta="center">
        We’ve sent a confirmation email to your inbox. Click the link in the
        email to finish signing up.
      </Text>
      <Text ta="center">
        Didn’t receive it? Try{" "}
        <Anchor href="/signup" variant="link">
          signing up again
        </Anchor>
      </Text>
    </Stack>
  );
};

export default SignupContent;
