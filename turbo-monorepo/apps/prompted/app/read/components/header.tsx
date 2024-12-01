import {
  Box,
  Grid,
  Select,
  Stack,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import CategoryMultiSelect from "./category-filter";

interface SearchHeaderProps {
  hasEntries: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  categoryFilters: string[];
  setCategoryFilters: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: string | null;
  setSortBy: React.Dispatch<React.SetStateAction<string | null>>;
  onResetFilters: () => void;
  entriesLength?: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  hasEntries,
  searchQuery,
  setSearchQuery,
  categoryFilters,
  setCategoryFilters,
  sortBy,
  setSortBy,
}) => {
  const { colorScheme } = useMantineColorScheme();

  const headingColor =
    colorScheme === "dark"
      ? "var(--mantine-color-dark-5)"
      : "var(--mantine-color-gray-0)";

  return (
    <Stack px="sm" align="end" gap="xs">
      <Box
        p="sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: headingColor,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 12, lg: 4 }}>
            <TextInput
              label="Prompt Search"
              placeholder="Type anything..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              disabled={!hasEntries}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <CategoryMultiSelect
              selectedCategories={categoryFilters}
              setSelectedCategories={setCategoryFilters}
              disabled={!hasEntries}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <Select
              label="Sort By"
              data={[
                { value: "dateAsc", label: "Date - Oldest First" },
                { value: "dateDesc", label: "Date - Newest First" },
                { value: "lengthAsc", label: "Length - Fastest First" },
                { value: "lengthDesc", label: "Length - Slowest First" },
                { value: "wordCountAsc", label: "Word Count - Shortest First" },
                { value: "wordCountDesc", label: "Word Count - Longest First" },
              ]}
              placeholder="None selected"
              value={sortBy}
              onChange={setSortBy}
              disabled={!hasEntries}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Stack>
  );
};

export default SearchHeader;
