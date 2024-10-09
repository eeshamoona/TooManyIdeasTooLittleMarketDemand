"use client";

import { useState } from "react";
import { Input, Button, Select, VStack, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { NEW_PROMPT_CATEGORIES } from "../interface";

export default function AddPromptForm() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!text || !category) return;

    const res = await fetch("/api/addPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, category }),
    });

    if (res.ok) {
      setText("");
      setCategory("");
      router.refresh();
    } else {
      console.error("Failed to add prompt");
    }
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
      <HStack>
        <Input
          placeholder="Enter your journal prompt"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Select
          placeholder="Select category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {NEW_PROMPT_CATEGORIES.map((category) => (
            <option key={category.title} value={category.title}>
              {category.title}: {""}
              {category.description}
            </option>
          ))}
        </Select>
      </HStack>
      <Button type="submit" colorScheme="teal">
        Add Prompt
      </Button>
    </VStack>
  );
}
