"use client";

import { useState } from "react";
import { Input, Button, Select, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

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
      router.refresh(); // Refresh to load new prompts
    } else {
      console.error("Failed to add prompt");
    }
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
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
        <option value="self-reflection">Self Reflection</option>
        <option value="productivity">Productivity</option>
        <option value="creativity">Creativity</option>
      </Select>
      <Button type="submit" colorScheme="teal">
        Add Prompt
      </Button>
    </VStack>
  );
}
