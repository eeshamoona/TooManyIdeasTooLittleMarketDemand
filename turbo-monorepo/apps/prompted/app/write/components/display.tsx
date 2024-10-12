"use client";
import { Container, Title, Text, Button, Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NEW_PROMPT_CATEGORIES } from "../interface";
import TrackedTextarea from "./tracked-textarea";

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
    setFilteredPrompts(filtered);
  };

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
    setRandomPrompt(filteredPrompts[randomIndex]);
  };

  return (
    <Container>
      <Title order={1} mt="xl">
        Hello World
      </Title>
      <Button variant="outline" onClick={() => router.push("write/more")}>
        Settings
      </Button>
      <Text mt="md">Welcome to my simple Mantine application.</Text>

      <Select
        placeholder="Select category"
        data={NEW_PROMPT_CATEGORIES.map((category) => ({
          value: category.title,
          label: `${category.title}: ${category.description}`,
        }))}
        onChange={handleFilterChange}
      />

      <Button mt="md" onClick={handleRandomPrompt}>
        Get Random Prompt
      </Button>

      <TrackedTextarea promptText={randomPrompt?.text} />

      <div>
        {filteredPrompts.map((prompt, index) => (
          <div key={index}>
            <h3>{prompt.text}</h3>
            <p>{prompt.category}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
