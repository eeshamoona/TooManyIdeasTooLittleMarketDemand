"use client";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { MdOutlineEdit, MdOutlineEditOff } from "react-icons/md";
import { EntryCard } from "./card";
import { EmptyState } from "./empty-state";
import SearchHeader from "./header";
import { NoResults } from "./no-results";

export default function DisplayEntries({ data }: any) {
  const [entries, setEntries] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

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
        setEntries(entries.filter((e) => e.id !== entryId)); // Remove it from the array
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
        const matchesQuery = searchQuery
          ? entry.text.includes(searchQuery) ||
            (entry.prompt && entry.prompt.includes(searchQuery))
          : true;

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

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      deleteEntryCallback(entryToDelete.id);
      setIsModalOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setIsModalOpen(true);
  };

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
      mt="lg"
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
      <Group px="md" p="xs" justify="end">
        <Text c="dimmed">Results: {filteredEntries.length} entries</Text>
        <ActionIcon
          onClick={() => setEditMode(!editMode)}
          variant="subtle"
          size="lg"
          radius="sm"
          color={editMode ? "red" : ""}
        >
          {editMode ? <MdOutlineEditOff /> : <MdOutlineEdit />}
        </ActionIcon>
      </Group>
      <Box p="sm" style={{ flexGrow: 1, overflowY: "auto" }}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              editMode={editMode}
              deleteEntryCallback={() => handleDeleteClick(entry)} // Trigger modal
              staticMode={false}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={<Text fw="bold">Confirm Delete</Text>}
      >
        <Text size="sm">
          Want to delete this entry? This action cannot be undone!
        </Text>
        <Text c="dimmed" size="sm" mb="sm">
          Feel free to export your writing before you delete it.
        </Text>

        <EntryCard
          entry={entryToDelete}
          editMode={false}
          deleteEntryCallback={null}
          staticMode={true}
        />

        <Group justify="space-between" mt="md">
          <Button variant="default" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
