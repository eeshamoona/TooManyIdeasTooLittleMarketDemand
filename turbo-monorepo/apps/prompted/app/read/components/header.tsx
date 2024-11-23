import React from "react";
import {
  useMantineColorScheme,
  Box,
  Center,
  TextInput,
  MultiSelect,
  Select,
  Button,
  ActionIcon,
  Badge,
} from "@mantine/core";
import CategoryMultiSelect from "./category-filter";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import { FaTimes } from "react-icons/fa";

interface SearchHeaderProps {
  hasEntries: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  categoryFilters: string[];
  setCategoryFilters: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: string | null;
  setSortBy: React.Dispatch<React.SetStateAction<string | null>>;
  onResetFilters: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  hasEntries,
  searchQuery,
  setSearchQuery,
  categoryFilters,
  setCategoryFilters,
  sortBy,
  setSortBy,
  onResetFilters,
}) => {
  const { colorScheme } = useMantineColorScheme();

  const headingColor =
    colorScheme === "dark"
      ? "var(--mantine-color-dark-5)"
      : "var(--mantine-color-gray-0)";

  const handleFilterRemove = (filter: string) => {
    setCategoryFilters((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <Box
      p="sm"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: headingColor,
        borderRadius: 5,
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      {/* Search Input */}
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        style={{ flex: 1, minWidth: "200px" }}
        disabled={!hasEntries}
      />

      {/* Multi-Select Filters */}
      {/* <MultiSelect
        data={NEW_PROMPT_CATEGORIES.map((category) => ({
          label: category.title,
          value: category.title,
        }))}
        placeholder="Filter by categories"
        value={categoryFilters}
        onChange={setCategoryFilters}
        disabled={!hasEntries}
        searchable
        clearable
      /> */}
        <CategoryMultiSelect
          selectedCategories={categoryFilters}
          setSelectedCategories={setCategoryFilters}
        />

      {/* Sort By Dropdown */}
      <Select
        data={[
          { value: "dateAsc", label: "Date: Oldest First" },
          { value: "dateDesc", label: "Date: Newest First" },
          { value: "lengthAsc", label: "Length: Shortest First" },
          { value: "lengthDesc", label: "Length: Longest First" },
          { value: "wordCountAsc", label: "Word Count: Fewest First" },
          { value: "wordCountDesc", label: "Word Count: Most First" },
        ]}
        placeholder="Sort by"
        value={sortBy}
        onChange={setSortBy}
        disabled={!hasEntries}
        clearable
      />

      {/* Active Filters Display */}
      {/* <Box style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {categoryFilters.map((filter) => (
          <Badge
            key={filter}
            variant="outline"
            rightSection={
              <ActionIcon size="xs" onClick={() => handleFilterRemove(filter)}>
                <FaTimes />
              </ActionIcon>
            }
          >
            {filter}
          </Badge>
        ))}
      </Box> */}

      {/* Reset Button */}
      <Button onClick={onResetFilters} variant="light" disabled={!hasEntries}>
        Reset
      </Button>
    </Box>
  );
};

export default SearchHeader;
