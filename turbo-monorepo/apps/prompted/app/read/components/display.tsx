"use client";
import { Box, Container, SimpleGrid, Stack } from "@mantine/core";
import { EntryCard } from "./card";
import SearchHeader from "./header";
import { EmptyState } from "./empty-state";

export default function DisplayEntries({ data: entries }) {
  if (!entries || entries.length === 0) {
    return (
      <Container>
        <SearchHeader hasEntries={false} />
        <EmptyState />
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
      <SearchHeader hasEntries={false} />

      <Box
        p="sm"
        style={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
