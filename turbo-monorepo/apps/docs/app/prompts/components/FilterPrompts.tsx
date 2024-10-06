// app/prompts/components/Filter.tsx
"use client";

import { useState } from "react";
import { VStack, CheckboxGroup, Checkbox, Button } from "@chakra-ui/react";
import PromptDisplay from "./PromptDisplay";

const categories = [
  "Gratitude",
  "Creative Thinking",
  "Emotional Clarity",
  "Future Life Visualization",
  "Problem Solving",
  "Self-Reflection",
  "Topical Exploration",
  "Wellness",
  "Skill-Building",
  "Challenge-Based Prompts",
];

export default function Filter({ prompts }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [randomPrompt, setRandomPrompt] = useState(null);

  // Filter prompts by selected categories
  const filteredPrompts = prompts.filter((prompt) =>
    selectedCategories.every((category) => prompt.categories.includes(category))
  );

  // Get a random prompt from the filtered list
  const getRandomPrompt = () => {
    if (filteredPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
      setRandomPrompt(filteredPrompts[randomIndex]);
    } else {
      setRandomPrompt(null);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <CheckboxGroup
        colorScheme="teal"
        value={selectedCategories}
        onChange={setSelectedCategories}
      >
        {categories.map((category) => (
          <Checkbox key={category} value={category}>
            {category}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <Button colorScheme="teal" onClick={getRandomPrompt}>
        Get Prompt
      </Button>

      {randomPrompt && <PromptDisplay prompt={randomPrompt} />}
    </VStack>
  );
}
