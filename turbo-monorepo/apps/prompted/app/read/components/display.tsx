"use client";

import React, { useState, useMemo } from "react";
import { Box, Container, SimpleGrid, Stack } from "@mantine/core";
import { EntryCard } from "./card";
import SearchHeader from "./header";
import { EmptyState } from "./empty-state";
import { NoResults } from "./no-results";

export default function DisplayEntries({ data: entries }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategory(null);
    setTags([]);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesQuery = searchQuery
        ? entry.text.includes(searchQuery) ||
          (entry.prompt && entry.prompt.includes(searchQuery))
        : true;
      const matchesCategory = category ? entry.category === category : true;
      const matchesTags =
        tags.length > 0
          ? tags.every((tag) => entry.metadata_stats?.tags?.includes(tag))
          : true;
      return matchesQuery && matchesCategory && matchesTags;
    });
  }, [entries, searchQuery, category, tags]);

  if (entries.length === 0) {
    return (
      <Container>
        <SearchHeader
          hasEntries={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          tags={tags}
          setTags={setTags}
        />
        <EmptyState />
      </Container>
    );
  }

  if (entries.length > 0 && filteredEntries.length === 0) {
    return (
      <Stack
        mt="xl"
        style={{
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {" "}
        <SearchHeader
          hasEntries={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          tags={tags}
          setTags={setTags}
        />
        <NoResults resetFilterCallback={resetFilters} />
      </Stack>
    );
  }

  return (
    <Stack
      mt="xl"
      style={{
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <SearchHeader
        hasEntries={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        tags={tags}
        setTags={setTags}
      />

      <Box
        p="sm"
        style={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
