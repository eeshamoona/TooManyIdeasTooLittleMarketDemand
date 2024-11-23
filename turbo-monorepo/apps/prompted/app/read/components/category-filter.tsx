import React from "react";
import {
  MultiSelect,
  Group,
  ActionIcon,
  Center,
  Text,
  Box,
  Badge,
  SelectProps,
} from "@mantine/core";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import { FaCheck, FaTimes } from "react-icons/fa";

interface CategoryMultiSelectProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
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
  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((item) => item !== category));
  };

  return (
    <MultiSelect
      data={NEW_PROMPT_CATEGORIES.map((category) => ({
        value: category.title,
        label: category.title,
        description: category.description,
        icon: category.icon,
      }))}
      placeholder="Select categories"
      value={selectedCategories}
      onChange={handleCategoryChange}
      searchable
      clearable
      renderOption={renderSelectOption}
      flex={2}
    />
  );
};

export default CategoryMultiSelect;
