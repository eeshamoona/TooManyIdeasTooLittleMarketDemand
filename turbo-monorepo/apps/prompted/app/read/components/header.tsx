import { Box, Flex, Select, Stack, TextInput } from "@mantine/core";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
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
  return (
    <Stack px="sm" align="end" gap="xs">
      <Box
        p="0"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <Flex direction={{ base: "column", sm: "row" }} gap="md">
          <Box flex={{ base: 1, sm: 1, lg: 4 }}>
            <TextInput
              placeholder="Search for any entry..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              disabled={!hasEntries}
              leftSection={<FaSearch />}
              flex={2}
            />
          </Box>
          <Box flex={{ base: 1, sm: 1, lg: 4 }}>
            <CategoryMultiSelect
              selectedCategories={categoryFilters}
              setSelectedCategories={setCategoryFilters}
              disabled={!hasEntries}
            />
          </Box>
          <Box flex={{ base: 1, sm: 1, lg: 4 }}>
            <Select
              data={[
                { value: "dateAsc", label: "Date - Oldest First" },
                { value: "dateDesc", label: "Date - Newest First" },
                { value: "lengthAsc", label: "Length - Fastest First" },
                { value: "lengthDesc", label: "Length - Slowest First" },
                { value: "wordCountAsc", label: "Word Count - Shortest First" },
                { value: "wordCountDesc", label: "Word Count - Longest First" },
              ]}
              placeholder="Sort by..."
              value={sortBy}
              onChange={setSortBy}
              disabled={!hasEntries}
              clearable
              leftSection={<TbArrowsSort />}
              flex={2}
            />
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
};

export default SearchHeader;
