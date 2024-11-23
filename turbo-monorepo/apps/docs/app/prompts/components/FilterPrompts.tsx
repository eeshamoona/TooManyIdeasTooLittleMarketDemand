"use client";
import { useState } from "react";
import { VStack, Button, Select } from "@chakra-ui/react";
import PromptDisplay from "./PromptDisplay";
import { NEW_PROMPT_CATEGORIES } from "../interface";

export default function Filter({ prompts }) {
  // const [selectedCategories, setSelectedCategories] = useState([]);
  const [randomPrompt, setRandomPrompt] = useState(null);

  const [filter, setFilter] = useState("");

  const filteredPrompts = prompts.filter((prompt) =>
    filter ? prompt.category === filter : true,
  );

  const getRandomPrompt = () => {
    if (filteredPrompts.length > 1) {
      let randomIndex;
      let newPrompt;
      do {
        randomIndex = Math.floor(Math.random() * filteredPrompts.length);
        newPrompt = filteredPrompts[randomIndex];
      } while (newPrompt === randomPrompt);
      setRandomPrompt(newPrompt);
    } else if (filteredPrompts.length === 1) {
      setRandomPrompt(filteredPrompts[0]);
    } else {
      setRandomPrompt(null);
    }
  };

  return (
    <VStack spacing={4} maxWidth="80%" margin="0 auto">
      <Select
        placeholder="Filter prompts by category"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {NEW_PROMPT_CATEGORIES.map((category) => (
          <option key={category.title} value={category.title}>
            {category.title}: {""}
            {category.description}
          </option>
        ))}
      </Select>

      <Button colorScheme="blue" width={"full"} onClick={getRandomPrompt}>
        Get Prompt
      </Button>

      {randomPrompt && <PromptDisplay prompt={randomPrompt} />}
    </VStack>
  );
}
