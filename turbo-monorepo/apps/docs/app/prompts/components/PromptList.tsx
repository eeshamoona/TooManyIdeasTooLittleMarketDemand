"use client";

import { useState } from "react";
import { VStack, Select, List, ListItem, Text } from "@chakra-ui/react";
import { NEW_PROMPT_CATEGORIES } from "../interface";

export default function PromptList({ prompts }) {
  const [filter, setFilter] = useState("");

  const filteredPrompts = prompts.filter((prompt) =>
    filter ? prompt.category === filter : true,
  );

  return (
    <VStack spacing={4} align="stretch">
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

      <List spacing={3}>
        {filteredPrompts.map((prompt) => (
          <ListItem key={prompt.id}>
            <Text fontWeight="bold">{prompt.category}</Text>
            <Text>{prompt.text}</Text>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
}
