import { Title, Anchor, Text } from "@mantine/core";

const DefaultContent: React.FC = () => {
  return (
    <>
      <Title order={2} mb="md">
        📬 Check Your Email!
      </Title>
      <Text mb="lg">
        We’ve sent you an email. Please check your inbox for further
        instructions. If you don’t see the email, check your spam or junk
        folder.
      </Text>
    </>
  );
};

export default DefaultContent;
