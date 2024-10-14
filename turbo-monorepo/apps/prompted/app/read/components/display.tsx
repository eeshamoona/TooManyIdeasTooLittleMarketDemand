"use client";
import { Box, Container, SimpleGrid, Stack, Text } from "@mantine/core";
import { SubmissionCard } from "./card";
import SearchHeader from "./header";

export default function DisplaySubmissions({ data }) {
  if (!data || data.length === 0) {
    return (
      <Container>
        <SearchHeader hasSubmissions={false} />
        <Text c="red">No submissions found.</Text>
      </Container>
    );
  }

  return (
    <Stack
      mt="xl"
      style={{
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SearchHeader hasSubmissions={false} />

      <Box
        p="sm"
        style={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
          {data.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
