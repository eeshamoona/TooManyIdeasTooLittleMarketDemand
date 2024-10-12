"use client";
import {
  Container,
  Title,
  Button,
  Select,
  Group,
  Divider,
  Center,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NEW_PROMPT_CATEGORIES } from "../interface";
import TrackedTextarea from "./tracked-textarea";
import { PromptList } from "./prompt-list";
import { FaCog } from "react-icons/fa";

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

  const handleFilterChange = (value: string) => {
    const filtered = prompts.filter((prompt) => prompt.category === value);
    console.log(value);
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

  return (
    <Container>
      <Group mt="xl" align="center" justify="space-between">
        <Title order={1}>Prompt Generator</Title>
        <Button
          variant="outline"
          onClick={() => router.push("write/more")}
          leftSection={<FaCog />}
        >
          Settings
        </Button>
      </Group>

      <Group my="lg" align="center">
        <Select
          flex={1}
          placeholder="All prompts!"
          data={NEW_PROMPT_CATEGORIES.map((category) => ({
            value: category.title,
            label: `${category.title}: ${category.description}`,
          }))}
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
          <Center p={"1rem"} bg="var(--mantine-color-gray-light)">
            <PromptList data={filteredPrompts} />
          </Center>
        </>
      )}
    </Container>
  );
}
