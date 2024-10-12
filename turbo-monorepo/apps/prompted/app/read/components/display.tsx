"use client";
import { Box, Button, Container, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiPencil } from "react-icons/ti";

export default function DisplaySubmissions({ data }) {
  const router = useRouter();

  if (!data || data.length === 0) {
    return (
      <Container>
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="subtle"
            leftSection={<TiPencil />}
            onClick={() => router.push("/write")}
          >
            Write!
          </Button>
        </Box>
        <Text c="red">No submissions found.</Text>
      </Container>
    );
  }

  return (
    <Box>
      <Box my={"md"} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="subtle"
          leftSection={<TiPencil />}
          onClick={() => router.push("/write")}
        >
          Write!
        </Button>
      </Box>
      {data.map((submission) => (
        <Link href={`/read/${submission.id}`} key={submission.id} passHref>
          <Paper
            mb="md"
            p="md"
            shadow="sm"
            withBorder
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Text size="lg">{submission.text}</Text>
            <Text c="dimmed" size="sm">
              {submission.category}
            </Text>
            <Text c="dimmed" size="xs">
              {new Date(submission.created_at).toLocaleDateString()}
            </Text>
            <Text c="dimmed" size="sm">
              {submission.prompt}
            </Text>
          </Paper>
        </Link>
      ))}
    </Box>
  );
}
