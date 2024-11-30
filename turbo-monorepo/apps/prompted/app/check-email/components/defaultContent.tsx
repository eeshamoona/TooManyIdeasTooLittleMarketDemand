import { Text, Title } from "@mantine/core";

const DefaultContent: React.FC = () => {
  return (
    <>
      <Title order={2} mb="md">
        📬 Check Your Email!
      </Title>
      <Text mb="lg">
        We’ve sent you an email. Please check your inbox for further
        instructions. If you don’t see the email, you can ignore this
        notification.
      </Text>
    </>
  );
};

export default DefaultContent;
