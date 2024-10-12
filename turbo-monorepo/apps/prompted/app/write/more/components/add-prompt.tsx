"use client";
import { useEffect, useState } from "react";
import {
  TextInput,
  Select,
  Group,
  Paper,
  Button,
  SelectProps,
  Text,
  Center,
} from "@mantine/core";
import { NEW_PROMPT_CATEGORIES } from "../../interface";
import { useRouter } from "next/navigation";
import { FaCheck, FaPaperPlane } from "react-icons/fa";

export const AddPromptForm = () => {
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

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

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const Icon = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === option.value,
    )?.icon;
    return (
      <Group
        flex="1"
        align="center"
        style={{
          padding: "0px", // Add padding for better spacing
          borderRadius: "8px", // Rounded corners for smoother edges
          cursor: "pointer", // Indicate interactivity
          gap: "0px",
        }}
      >
        {Icon && (
          <Center>
            <Icon style={{ marginRight: "8px" }} />
          </Center>
        )}
        <Text
          style={{
            fontWeight: "600", // Semi-bold for better readability
            fontSize: "14px", // Slightly larger for better legibility
          }}
        >
          {option.value}
        </Text>
        <Text
          c="dimmed"
          style={{
            fontSize: "12px", // Keep the label smaller for a subtle look
          }}
        >
          {option["description"]}
        </Text>
        {checked && (
          <FaCheck
            style={{
              marginLeft: "auto", // Push the check icon to the right
              color: "#1976d2", // Give it a pleasant, accent color
            }}
          />
        )}
      </Group>
    );
  };

  return (
    <Paper
      radius="sm"
      p="md"
      my="md"
      bg="var(--mantine-color-gray-light-hover)"
    >
      <Group>
        <TextInput
          label="Prompt"
          placeholder="Enter your prompt"
          value={promptText}
          onChange={(event) => setPromptText(event.currentTarget.value)}
          required
          flex={1}
        />
        <Group>
          <Select
            label="Category"
            placeholder="Select a category"
            data={NEW_PROMPT_CATEGORIES.map((category) => ({
              value: category.title,
              label: category.title,
              description: category.description,
              icon: category.icon,
            }))}
            value={category}
            onChange={setCategory}
            required
            renderOption={renderSelectOption}
          />
          <Button
            onClick={handleSubmit}
            style={{
              alignSelf: "end",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            px={"sm"}
            variant="light"
            color="blue"
          >
            <FaPaperPlane />
          </Button>
        </Group>
      </Group>
      {error && (
        <Text
          c="red"
          size="sm"
          style={{
            textAlign: "center", // Center the text for better alignment
            marginTop: "0.5rem", // Add some spacing between the input and the text
          }}
        >
          {error}
        </Text>
      )}
      {success && (
        <Text
          c="green"
          size="sm"
          style={{
            textAlign: "center", // Center the text for better alignment
            marginTop: "0.5rem", // Add some spacing between the input and the text
          }}
        >
          {success}
        </Text>
      )}
    </Paper>
  );
};
