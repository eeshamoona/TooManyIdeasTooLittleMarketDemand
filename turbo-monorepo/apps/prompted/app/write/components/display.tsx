"use client";
import { Container, Title, Button, Select, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NEW_PROMPT_CATEGORIES } from "../interface";
import TrackedTextarea from "./tracked-textarea";
import { PromptList } from "./prompt-list";
import { FaCog } from "react-icons/fa";

interface Prompt {
  text: string;
  category: string;
}

interface DisplayProps {
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
        <Button onClick={handleRandomPrompt}>Get Random Prompt</Button>
      </Group>
      {randomPrompt && (
        <TrackedTextarea
          promptText={randomPrompt?.text}
          categoryText={randomPrompt?.category}
        />
      )}
      <PromptList data={filteredPrompts} />
    </Container>
  );
}
