"use client";
import { Box, Button, Container, SimpleGrid, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { TiPencil } from "react-icons/ti";
import { SubmissionCard } from "./card";

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
      <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
        {data.map((submission) => (
          <SubmissionCard key={submission.id} submission={submission} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
