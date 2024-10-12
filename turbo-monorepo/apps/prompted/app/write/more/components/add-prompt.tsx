"use client";
import { useState } from "react";
import {
  TextInput,
  Select,
  Button,
  Group,
  Box,
  Notification,
} from "@mantine/core";
import { NEW_PROMPT_CATEGORIES } from "../../interface";
import { useRouter } from "next/navigation";

export const AddPromptForm = () => {
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!promptText || !category) {
      setError("Please fill in all fields");
      return;
    }

    const res = await fetch("/api/addPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: promptText, category }),
    });

    if (res.ok) {
      setPromptText("");
      setCategory("");
      setSuccess("Prompt added successfully");
      setError("");
      router.refresh();
    } else {
      setError("Failed to add prompt");
      setSuccess("");
    }
  }

  return (
    <Box p={"md"}>
      {error && <Notification color="red">{error}</Notification>}
      {success && <Notification color="green">{success}</Notification>}
      <TextInput
        label="Prompt"
        placeholder="Enter your prompt"
        value={promptText}
        onChange={(event) => setPromptText(event.currentTarget.value)}
        required
      />

      <Select
        flex={1}
        label="Category"
        placeholder="Select a category"
        data={NEW_PROMPT_CATEGORIES.map((category) => ({
          value: category.title,
          label: `${category.title}: ${category.description}`,
        }))}
        value={category}
        onChange={setCategory}
        required
      />
      <Group mt="md">
        <Button onClick={handleSubmit}>Add Prompt</Button>
      </Group>
    </Box>
  );
};
