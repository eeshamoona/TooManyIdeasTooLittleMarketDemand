"use client";
import {
  Button,
  Select,
  Group,
  Divider,
  Center,
  SelectProps,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NEW_PROMPT_CATEGORIES } from "../interface";
import TrackedTextarea from "./tracked-textarea";
import { PromptList } from "./prompt-list";
import { FaCheck } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbWriting } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

export interface Prompt {
  text: string;
  category: string;
}

export interface DisplayProps {
  prompts: Prompt[];
}

export default function Display({ prompts }: DisplayProps) {
  const router = useRouter();
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);
  const [randomPrompt, setRandomPrompt] = useState<Prompt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFilterChange = (value: string) => {
    const filtered = prompts.filter((prompt) => prompt.category === value);
    if (!value) {
      setFilteredPrompts(prompts);
    } else {
      setFilteredPrompts(filtered);
    }
  };

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
    const randomPrompt = filteredPrompts[randomIndex];
    setSelectedCategory(randomPrompt.category);
    setRandomPrompt(randomPrompt);
  };

  const clearRandomPrompt = () => {
    setFilteredPrompts(prompts);
    setSelectedCategory(null);
    setRandomPrompt(null);
  };

  const leftSectionIcon = () => {
    const category = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === selectedCategory
    );

    const Icon = category?.icon;
    const color = category?.color
      ? `var(--mantine-color-${category?.color}-5)`
      : "var(--mantine-color-dimmed)";

    return (
      <ActionIcon variant="transparent" color={color} size="lg">
        {Icon ? <Icon /> : <TbWriting />}
      </ActionIcon>
    );
  };

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

  return (
    <>
      <Group mt="xl" style={{ justifyContent: "flex-start" }} gap="0">
        <Button
          variant="outline"
          px={"sm"}
          color={"blue"}
          onClick={() => router.push("read")}
          leftSection={<LuLayoutDashboard />}
        >
          View All
        </Button>
      </Group>

      <Group my={"md"} align="center">
        <Select
          flex={1}
          clearable={randomPrompt ? false : true}
          defaultValue={null}
          placeholder="Filter by category"
          data={NEW_PROMPT_CATEGORIES.map((category) => ({
            value: category.title,
            label: category.title,
            description: category.description,
            icon: category.icon,
          }))}
          renderOption={renderSelectOption}
          size="md"
          value={selectedCategory}
          onChange={(value) => {
            if (!randomPrompt || !randomPrompt.category) {
              setSelectedCategory(value);
              handleFilterChange(value);
            }
          }}
          leftSection={leftSectionIcon()}
        />
        <Button
          color={randomPrompt ? "red" : "blue"}
          onClick={randomPrompt ? clearRandomPrompt : handleRandomPrompt}
          variant={randomPrompt ? "subtle" : "filled"}
          rightSection={randomPrompt ? <RxCross2 /> : null}
        >
          {/* {randomPrompt ? "Reset Prompt" : "Get Random Prompt"} */}
          {randomPrompt
            ? "Reset Prompt"
            : selectedCategory
              ? `Get Random ${selectedCategory} Prompt`
              : "Get Random Prompt"}
        </Button>
      </Group>
      {randomPrompt ? (
        <TrackedTextarea
          promptText={randomPrompt?.text}
          categoryText={randomPrompt?.category}
        />
      ) : (
        <>
          <Divider my="md" />
          <PromptList data={filteredPrompts} />
        </>
      )}
    </>
  );
}
