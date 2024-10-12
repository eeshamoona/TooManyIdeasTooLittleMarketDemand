"use client";
import { Container, Title, Text, Button, Group } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Write() {
  const router = useRouter();

  return (
    <Container>
      <Group mt="xl">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </Group>
      <Title order={1} mt="xl">
        Hello World
      </Title>
      <Text mt="md">Settings</Text>
    </Container>
  );
}
