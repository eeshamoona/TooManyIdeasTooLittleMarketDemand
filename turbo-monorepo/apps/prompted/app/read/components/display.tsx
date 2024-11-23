"use client";
import React, { useState, useMemo } from "react";
import {
  ActionIcon,
  Box,
  Container,
  SimpleGrid,
  Stack,
  Group,
  Text,
} from "@mantine/core";
import { EntryCard } from "./card";
import SearchHeader from "./header";
import { EmptyState } from "./empty-state";
import { NoResults } from "./no-results";
import { IoTrash } from "react-icons/io5";
import { TbEdit, TbEditOff } from "react-icons/tb";

export default function DisplayEntries({ data }: any) {
  const [entries, setEntries] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilters([]);
    setSortBy(null);
  };

  const deleteEntryCallback = async (entryId) => {
    try {
      const response = await fetch("/api/deleteEntry", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: entryId }),
      });

      if (response.ok) {
        console.log("Entry deleted successfully");
        //Remove it from the array
        setEntries(entries.filter((e) => e.id !== entryId));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete entry:", errorData.error);
      }
    } catch (err) {
      console.error("An error occurred while deleting the entry:", err);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        // Filter by search query
        const matchesQuery = searchQuery
          ? entry.text.includes(searchQuery) ||
            (entry.prompt && entry.prompt.includes(searchQuery))
          : true;

        // Filter by categories
        const matchesCategory =
          categoryFilters.length === 0 ||
          categoryFilters.includes(entry.category);

        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "dateAsc")
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        if (sortBy === "dateDesc")
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        if (sortBy === "lengthAsc")
          return a.metadata_stats.elapsedTime - b.metadata_stats.elapsedTime;
        if (sortBy === "lengthDesc")
          return b.metadata_stats.elapsedTime - a.metadata_stats.elapsedTime;
        if (sortBy === "wordCountAsc")
          return a.metadata_stats.totalWords - b.metadata_stats.totalWords;
        if (sortBy === "wordCountDesc")
          return b.metadata_stats.totalWords - a.metadata_stats.totalWords;
        return 0;
      });
  }, [entries, searchQuery, categoryFilters, sortBy]);

  if (entries.length === 0) {
    return (
      <Container>
        <SearchHeader
          hasEntries={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilters={categoryFilters}
          setCategoryFilters={setCategoryFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={resetFilters}
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
          categoryFilters={categoryFilters}
          setCategoryFilters={setCategoryFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={resetFilters}
        />
        <NoResults resetFilterCallback={resetFilters} />
      </Stack>
    );
  }

  return (
    <Stack
      mt="xl"
      gap={0}
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
        categoryFilters={categoryFilters}
        setCategoryFilters={setCategoryFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={resetFilters}
        entriesLength={filteredEntries.length}
      />
      <Group px="md" py={3} justify="space-between">
        <Text c="dimmed">Results: {filteredEntries.length} entries</Text>
        <ActionIcon
          onClick={() => setEditMode(!editMode)}
          variant="subtle"
          size="lg"
          radius="md"
          color={editMode ? "red" : ""}
        >
          {editMode ? <TbEditOff /> : <TbEdit />}
        </ActionIcon>
      </Group>
      <Box p="sm" style={{ flexGrow: 1, overflowY: "auto" }}>
        <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              editMode={editMode}
              deleteEntryCallback={deleteEntryCallback}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
