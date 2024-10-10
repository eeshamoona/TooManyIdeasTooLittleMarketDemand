"use client";
import { Container, Paper, Title, Text, Button, Group } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <Container size="100vw">
      <Paper
        p="xl"
        radius="md"
        shadow="md"
        style={{ width: "90%", maxWidth: "400px", alignContent: "center" }}
      >
        <Title order={2} mb="lg">
          Login Error: Invalid Credentials!
        </Title>
        <Text mb="md">
          There was an issue with your login. Please try again.
        </Text>
        <Group>
          <Button onClick={handleBackToLogin}>Back to Login</Button>
        </Group>
      </Paper>
    </Container>
  );
}
