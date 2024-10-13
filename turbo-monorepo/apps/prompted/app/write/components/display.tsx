"use client";
import {
  Container,
  Button,
  Select,
  Group,
  Divider,
  useMantineColorScheme,
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
import { FaCheck, FaCog } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

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
  const { colorScheme } = useMantineColorScheme();

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
    setRandomPrompt(filteredPrompts[randomIndex]);
  };

  const clearRandomPrompt = () => {
    setRandomPrompt(null);
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const category = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === option.value,
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
    <Container>
      <Group mt="xl" style={{ justifyContent: "flex-end" }} gap="0">
        <Button
          variant="subtle"
          px={"sm"}
          color={"blue"}
          onClick={() => router.push("read")}
          leftSection={<LuLayoutDashboard />}
        >
          View All
        </Button>
        <Button
          variant="subtle"
          px={"sm"}
          color={colorScheme === "dark" ? "light" : "dark"}
          onClick={() => router.push("write/more")}
        >
          <FaCog />
        </Button>
      </Group>

      <Group my={"md"} align="center">
        <Select
          flex={1}
          placeholder="All prompts!"
          data={NEW_PROMPT_CATEGORIES.map((category) => ({
            value: category.title,
            label: category.title,
            description: category.description,
            icon: category.icon,
          }))}
          renderOption={renderSelectOption}
          size="md"
          onChange={handleFilterChange}
        />
        <Button
          color={randomPrompt ? "red" : "blue"}
          onClick={randomPrompt ? clearRandomPrompt : handleRandomPrompt}
        >
          {randomPrompt ? "Clear Random Prompt" : "Get Random Prompt"}
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
    </Container>
  );
}
