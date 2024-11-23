import React from "react";
import {
  useMantineColorScheme,
  Box,
  TextInput,
  Select,
  Button,
  SelectProps,
  ActionIcon,
  Center,
  Group,
  Text,
} from "@mantine/core";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import { FaCheck } from "react-icons/fa";

// Define the interface for SearchHeader props
interface SearchHeaderProps {
  hasEntries: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  category: string | null;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const renderSelectOption: SelectProps["renderOption"] = ({
  option,
  checked,
}) => {
  const category = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === option.value
  );
  const Icon = category?.icon;
  const color = category?.color;
  return (
    <Group
      flex="1"
      align="center"
      style={{
        padding: "0px", // Add padding for better spacing
        borderRadius: "8px", // Rounded corners for smoother edges
        cursor: "pointer", // Indicate interactivity
      }}
      gap="sm"
    >
      {Icon && (
        <Center>
          <ActionIcon variant="light" color={color} size="lg">
            <Icon />
          </ActionIcon>
        </Center>
      )}
      <Text
        style={{
          fontWeight: "600", // Semi-bold for better readability
          fontSize: "14px", // Slightly larger for better legibility
        }}
      >
        {option.value}
      </Text>
      <Text
        c="dimmed"
        style={{
          fontSize: "12px", // Keep the label smaller for a subtle look
        }}
      >
        {option["description"]}
      </Text>
      {checked && (
        <FaCheck
          style={{
            marginLeft: "auto", // Push the check icon to the right
            color: "#1976d2", // Give it a pleasant, accent color
          }}
        />
      )}
    </Group>
  );
};

const SearchHeader: React.FC<SearchHeaderProps> = ({
  hasEntries,
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  tags,
  setTags,
}) => {
  const { colorScheme } = useMantineColorScheme();

  const headingColor =
    colorScheme === "dark"
      ? "var(--mantine-color-dark-5)"
      : "var(--mantine-color-gray-0)";

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
        gap: "1rem",
        alignItems: "center",
      }}
    >
      {/* Search Input */}
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        style={{ flex: 1 }}
        disabled={!hasEntries}
      />

      {/* Category Selector */}
      <Select
        placeholder="Select a category"
        data={NEW_PROMPT_CATEGORIES.map((category) => ({
          value: category.title,
          label: category.title,
          description: category.description,
          icon: category.icon,
        }))}
        value={category}
        onChange={setCategory}
        renderOption={renderSelectOption}
        disabled={!hasEntries}
      />

      {/* Search Button */}
      <Button onClick={() => {}} disabled={!hasEntries}>
        Search
      </Button>
    </Box>
  );
};

export default SearchHeader;
