"use client";

import { useState } from "react";
import { VStack, Select, List, ListItem, Text } from "@chakra-ui/react";

export default function PromptList({ prompts }) {
  const [filter, setFilter] = useState("");

  const filteredPrompts = prompts.filter((prompt) =>
    filter ? prompt.category === filter : true
  );

  return (
    <VStack spacing={4} align="stretch">
      <Select
        placeholder="Filter by category"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="self-reflection">Self Reflection</option>
        <option value="productivity">Productivity</option>
        <option value="creativity">Creativity</option>
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
