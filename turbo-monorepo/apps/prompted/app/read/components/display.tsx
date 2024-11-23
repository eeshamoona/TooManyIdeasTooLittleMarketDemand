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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const resetFilters = () => {
    setSearchQuery("");
    setCategory(null);
    setSortOrder("none");
  };

  const filteredEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const matchesQuery = searchQuery
        ? entry.text.includes(searchQuery) ||
          (entry.prompt && entry.prompt.includes(searchQuery))
        : true;
      const matchesCategory = category ? entry.category === category : true;
      return matchesQuery && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      if (sortOrder === "asc") return dateA - dateB;
      if (sortOrder === "desc") return dateB - dateA;
      return 0;
    });
  }, [entries, searchQuery, category, sortOrder]);

  if (entries.length === 0) {
    return (
      <Container>
        <SearchHeader
          hasEntries={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          dateSortOrder={sortOrder}
          setDateSortOrder={setSortOrder}
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
        <SearchHeader
          hasEntries={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          dateSortOrder={sortOrder}
          setDateSortOrder={setSortOrder}
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
        dateSortOrder={sortOrder}
        setDateSortOrder={setSortOrder}
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
