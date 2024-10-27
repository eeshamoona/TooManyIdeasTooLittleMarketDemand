"use client";
import React from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Anchor,
} from "@mantine/core";
import { useRouter } from "next/navigation";

const CheckEmailPage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/"); // Redirect to the home page or any other page
  };

  return (
    <Container size="sm" style={{ textAlign: "center", marginTop: "5rem" }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          📬 You're Almost There!
        </Title>
        <Text mb="lg">
          We've sent an email to your inbox with instructions to finish setting
          up your account. Be sure to check your spam or junk folder if you
          don't see it right away.
        </Text>
        <Text mb="lg">
          Still can’t find it? Try{" "}
          <Anchor href="/signup" variant="link" target="_blank">
            signing up
          </Anchor>{" "}
          again
        </Text>
        <Group justify="center" gap="md">
          <Button variant="filled" onClick={handleGoBack}>
            Back to Home
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default CheckEmailPage;
