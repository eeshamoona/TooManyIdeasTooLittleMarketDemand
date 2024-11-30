import { Title, Anchor, Text } from "@mantine/core";

const PasswordResetContent: React.FC = () => {
  return (
    <>
      <Title order={2} mb="md">
        📬 Reset Instructions Sent!
      </Title>
      <Text mb="lg">
        Check your inbox for a link to reset your password and keep the
        creativity flowing!
      </Text>
      <Text mb="lg">
        Can’t find it?{" "}
        <Anchor href="/login" variant="link">
          Try a magic link
        </Anchor>{" "}
        to log in and reset it from your profile.
      </Text>
    </>
  );
};

export default PasswordResetContent;
